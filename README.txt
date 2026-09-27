ASTM E1300 NFL V5 - GitHub Pages package

Upload all files and the charts folder to the repository root.

Features:
- Outer/Inner selection
- Monolithic or PVB laminated
- ASTM chart auto-selection
- Calibrated 4-side NFL calculation
- Original ASTM chart display
- Highlighted panel point, AR line, calibrated NFL contour and value

Calibration anchors:
- 6 mm monolithic 1200x1500 = 2.50 kPa
- 6 mm monolithic 1520x1900 = 1.80 kPa
- 6 mm monolithic 2000x2800 = 1.00 kPa
- 8 mm laminated 1520x1900 = 2.50 kPa

V6 FIXED:
- Fixed JavaScript syntax failure that prevented Calculate NFL from running.
- Fixed missing support-change event, so the Left/Right vs Top/Bottom selector now appears when 2-side support is selected.
- 2-side support passes supportedEdges into the NFL engine.
- A1.27/A1.43 output NFL plus highlighted thickness line, guides, intersection and value.

V6.1 RANGE FIX:
- A1.27 / A1.43 no longer report extrapolated precise NFL values outside the printed chart.
- Below chart minimum: display '< 0.25 kPa' for A1.27 or '< 0.20 kPa' for A1.43.
- Above chart maximum: display '> 10.00 kPa' or '> 8.00 kPa'.
- Monolithic 5 mm on A1.27 now displays 'NOT COVERED' instead of MANUAL.
- Out-of-range thickness line remains highlighted for visual review, but no fake intersection is plotted.

V6.2 ONE-EDGE:
- Added automatic ASTM one-edge/cantilever NFL for Fig. A1.28 (monolithic) and A1.44 (PVB laminated).
- When 1-side support is selected, user chooses Left / Right / Top / Bottom supported edge.
- Program derives the unsupported/cantilever length from panel width or height.
- A1.28 and A1.44 digitized line families use q = C/L^2, calibrated directly from the supplied ASTM chart images.
- Chart overlay highlights selected thickness/designation line, unsupported-length guide, intersection and NFL.
- Out-of-chart load or unsupported-length ranges are explicitly flagged instead of extrapolated as ASTM values.

V6.3 LAMINATED DESIGNATION DETAIL:
- Laminated input now shows ASTM minimum-thickness conversion for each glass ply.
- Example: 8 mm nominal -> 7.42 mm minimum; 10 mm nominal -> 9.02 mm minimum.
- Displays PVB contribution and total thickness used to select ASTM laminated designation.
- ASTM special designation cases are flagged when applied.

V7 GTF + LSF:
- Based directly on V6.3 source backup.
- Adds Single / Double IGU workflow with AN / HS / FT per lite.
- Adds Short Duration (<=3 s) / Long Duration (~30 days).
- GTF automatic lookup: ASTM Table 1 for single glazing; Tables 2/3 for Double IGU.
- GTF evidence table is rendered in-app with the selected ASTM cell highlighted.
- LSF automatic calculation follows ASTM Appendix X3 stiffness basis and identifies Table 5 / Table 6 applicability.
- LSF evidence is rendered in-app with the selected lite/result highlighted.
- NFL chart viewer and all 44 A1 figure files remain from V6.3.
- Single lite displays LSF = N/A.
- Double IGU with support other than four sides is explicitly flagged as outside the ASTM basic IGU procedure.

V7.1 LAMINATED PLY HEAT-TREATMENT TYPES:
- Each laminated ply now has its own AN / HS / FT selector.
- Laminated construction display preserves both ply thicknesses and both heat-treatment states.
- When both plies have the same type (AN+AN, HS+HS, FT+FT), automatic GTF lookup continues using ASTM Tables 1–3.
- When a laminated lite has mixed ply types (e.g. AN + PVB + HS), ASTM E1300-16 supplied source does not explicitly define which AN/HS/FT GTF category applies to that mixed lite.
- Mixed-ply GTF therefore shows REVIEW and no value is guessed.
- NFL designation and LSF calculation continue to work because their thickness/stiffness logic is independent of the heat-treatment label.

V7.2 ASTM GTF CLASSIFICATION:
- Laminated lites now include an "ASTM GTF Classification" selector: Auto / AN / HS / FT.
- Auto:
  * same ply heat treatment (AN+AN, HS+HS, FT+FT) -> automatic classification and GTF lookup.
  * mixed ply heat treatment (e.g. HS+AN) -> REVIEW because the supplied ASTM E1300-16 tables do not explicitly assign a category.
- Manual AN / HS / FT selection:
  * uses the user-selected category for ASTM Table 1 / 2 / 3 GTF lookup.
  * result and evidence panel explicitly mark the classification as user selected.
- NFL and LSF logic remains unchanged.

V7.3 AUTO WEAKEST-PLY GTF RULE:
- Laminated ply heat treatments remain independently selectable.
- Auto GTF classification now always resolves:
  * AN + HS -> AN
  * AN + FT -> AN
  * HS + FT -> HS
  * identical ply types -> that same type.
- This is a conservative PROJECT RULE ("weakest ply governs"), not an explicit ASTM E1300-16 mixed-ply classification rule.
- User can still override Auto and manually select AN / HS / FT.
- Result and evidence panels explicitly identify auto weakest-ply classifications versus user-selected classifications.
- NFL and LSF logic unchanged.

V8.0 DPT WIND INTEGRATION:
- Base: user's backed-up V7-4 ASTM E1300 package.
- Added Thailand DPT มยผ.1311-50 wind-load pre-check.
- Digitized Appendix A Table A-1 province wind groups for the 76 provinces in the 2007 standard.
- Special district logic included for Tak, Nakhon Si Thammarat and Surat Thani.
- Wind groups:
  Group 1 V50=25 m/s TF=1.00
  Group 2 V50=27 m/s TF=1.00
  Group 3 V50=29 m/s TF=1.00
  Group 4A V50=25 m/s TF=1.20
  Group 4B V50=25 m/s TF=1.08
- Chapter 2 simple-method reference pressure q = 0.5*rho*V^2 with rho=1.25 kg/m3.
- Simple-method terrain/exposure Ce formulas for A/B included.
- Importance factors digitized from Table 2-2.
- Small cladding/window Cg=2.5 and default internal Cgi=2.0 included.
- Internal pressure cases 1/2/3 digitized from Section 2.6.2.
- Windward Cp +0.8 and leeward Cp -0.5 presets included; custom Cp supported.
- Suggested pressure is a preliminary glass/cladding pressure and can be manually overridden.
- The final "Design Wind Pressure Used" is retained as the project input for future deflection / pass-fail integration.
- Local low-rise edge/corner coefficients still require the appropriate DPT Appendix B coefficient; use Custom Cp/manual override where applicable.

V8.1 DEFLECTION:
- Added ASTM E1300 deflection module connected to "Design Wind Pressure Used".
- Four-side monolithic glass:
  * automatic Appendix X1 approximate center deflection
  * uses ASTM Table 4 minimum thickness
  * E = 71.7 x 10^6 kPa
  * aspect ratio >5 is capped at 5 per X1
  * detailed formula evidence is shown in the Deflection tab
- Double IGU:
  * current BASIC estimate apportions design pressure to each lite using the current LSF before X1 deflection.
  * exact ASTM analytical IG deflection requires ideal-gas-law equilibrium / displaced-volume load sharing per 6.3.3.1; V8.1 does not claim that LSF estimate is the full analytical method.
- Laminated:
  * numerical automatic deflection is intentionally left as REVIEW because ASTM analytical deflection requires effective thickness hef,w from Appendix X9 using interlayer shear modulus for the temperature/load-duration condition.
  * original corresponding A1 lower deflection chart remains the ASTM basic-method source.
- 3-side / 2-side / 1-side:
  * shown as REVIEW until lower A1 deflection charts are numerically digitized; no unsupported X1 extrapolation is made.
- ASTM E1300 does not itself impose a universal aesthetic deflection limit; it requires deflection to be reviewed.

V8.2 FINAL PASS / FAIL:
- Added final engineering-result summary: PASS / FAIL / REVIEW.
- Strength check:
  * PASS when ASTM Load Resistance (LR) >= Design Wind Pressure Used.
  * FAIL when LR < Design Wind Pressure Used.
  * REVIEW when LR is unavailable for automatic judgement.
- Deflection criterion options:
  * Thailand Typical — L/90 and maximum 20 mm (PROJECT DEFAULT)
  * L/60
  * L/100
  * ASTM E1300 — Review only
  * Custom mm
- Thailand Typical logic: allowable deflection = min(short glass dimension / 90, 20 mm).
- ASTM E1300 itself does NOT impose this Thailand project limit; it requires glass deflection to be reviewed.
- Final result:
  * FAIL if any lite has Strength FAIL or Deflection FAIL.
  * REVIEW if there is no FAIL but any required check remains REVIEW.
  * PASS only when all automatic strength and deflection checks pass.
