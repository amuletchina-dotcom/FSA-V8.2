
const ASTMDeflection = (() => {
  const E = 71.7e6; // kPa, ASTM E1300 Appendix X1

  function x1FourSide({a,b,t,q}) {
    a = Number(a); b = Number(b); t = Number(t); q = Number(q);
    if (!(a>0 && b>0 && t>0 && q>0)) {
      return {ok:false,error:"Invalid X1 input."};
    }

    let long = Math.max(a,b);
    let short = Math.min(a,b);
    let ar = long/short;
    const arUsed = Math.min(ar,5);

    const r0 = 0.553 - 3.83*arUsed + 1.11*Math.pow(arUsed,2) - 0.0969*Math.pow(arUsed,3);
    const r1 = -2.29 + 5.83*arUsed - 2.17*Math.pow(arUsed,2) + 0.2067*Math.pow(arUsed,3);
    const r2 = 1.485 - 1.908*arUsed + 0.815*Math.pow(arUsed,2) - 0.0822*Math.pow(arUsed,3);

    const inner = q*Math.pow(long*short,2)/(E*Math.pow(t,4));
    if (!(inner>1)) {
      return {
        ok:false,
        lowLoad:true,
        inner,
        ar,
        arUsed,
        error:"Appendix X1 logarithmic expression is outside its usable range for this input."
      };
    }

    const x = Math.log(Math.log(inner));
    const w = t*Math.exp(r0 + r1*x + r2*x*x);

    return {
      ok:true,
      w,
      rounded:Math.round(w),
      r0,r1,r2,x,inner,
      ar,arUsed,
      long,short,t,q,E,
      caution:false
    };
  }

  function minThicknessForMonolithic(input){
    const nom = Number(input.thickness);
    return ASTM.min[nom] ?? nom;
  }

  function calcLite(r, totalDesignLoad, lsf, assembly){
    const support = document.getElementById("support").value;
    const input = r.input;
    let applied = Number(totalDesignLoad);

    if (assembly === "igu") {
      applied = Number(totalDesignLoad) * Number(lsf ?? 0);
    }

    const result = {
      appliedLoad:applied,
      totalDesignLoad:Number(totalDesignLoad),
      support,
      assembly,
      method:null,
      ok:false,
      location:null
    };

    if (support !== "4") {
      result.method = `ASTM Fig. A1.${r.figure} lower deflection chart`;
      result.chartReview = true;
      result.location =
        support==="3" ? "center of unsupported edge" :
        support==="2" ? "center of unsupported edge" :
        "free edge opposite supported edge";
      result.note = "Automatic numerical deflection is not enabled for this support condition yet; ASTM requires the lower chart of the corresponding Annex A1 figure.";
      return result;
    }

    if (input.kind === "lam") {
      result.method = `ASTM Fig. A1.${r.figure} lower deflection chart / analytical effective thickness`;
      result.chartReview = true;
      result.location = "center of glass";
      result.note = "For laminated glass, ASTM analytical deflection requires effective thickness hef,w from Appendix X9 using interlayer shear modulus for the temperature/load-duration condition. This V8.1 does not invent that modulus, so the numerical result is left for chart/effective-thickness review.";
      return result;
    }

    const t = minThicknessForMonolithic(input);
    const x1 = x1FourSide({
      a:r.geom.long,
      b:r.geom.short,
      t,
      q:applied
    });

    Object.assign(result,x1);
    result.method = "ASTM E1300 Appendix X1";
    result.location = "center of glass";
    result.minimumThickness = t;

    // ASTM X1 caution for pressures less than 1/3 design capacity of lite.
    // We use current LR when available as a practical trigger only.
    if (r.lr && applied < r.lr/3) result.caution = true;

    return result;
  }

  return {x1FourSide,calcLite,E};
})();
