/* ==========================================================================
   TEST CATALOGUE
   Every blood test the tracker knows about. To add a new test, copy one line
   and change it. Hindi names and meanings live in i18n-hi.js (section "tests").

   id    short code used inside the saved data (never change an existing id)
   n     plain everyday name shown in big text
   t     the name printed on the lab report (shown small)
   u     unit
   lo/hi healthy range (from her lab; the family can change it per report)
   main  1 = shown in the main list of the "Add a report" form
   kind  "diagnostic" = helps the doctor diagnose, not a goal to bring down
   m     what the test means, in plain words
   ========================================================================== */
window.AT = window.AT || {};
AT.TESTS = {
  crp:{n:"Inflammation level",t:"CRP",u:"mg/L",lo:0,hi:6,main:1,m:"Shows how much inflammation is in the body right now. The best blood test for checking if arthritis treatment is working."},
  esr:{n:"Inflammation speed",t:"ESR",u:"mm/hr",lo:0,hi:20,main:1,m:"A slower inflammation test, read together with CRP."},
  rf:{n:"Arthritis antibody",t:"RF, rheumatoid factor",u:"IU/ml",lo:0,hi:20,main:1,kind:"diagnostic",m:"A protein most people with rheumatoid arthritis have. It helps confirm the type of arthritis, but it does not show how she is doing, so it is not a goal."},
  accp:{n:"Arthritis antibody 2",t:"Anti-CCP",u:"U/ml",lo:0,hi:20,kind:"diagnostic",m:"The test that best confirms rheumatoid arthritis. Usually done once."},
  hb:{n:"Blood strength",t:"Hemoglobin",u:"g/dL",lo:11,hi:16.5,main:1,m:"Carries oxygen. Low blood strength (anemia) causes tiredness and breathlessness."},
  mcv:{n:"Red cell size",t:"MCV",u:"fL",lo:80,hi:97,main:1,m:"How big the red blood cells are. Small cells often mean low iron."},
  mch:{n:"Iron in each red cell",t:"MCH",u:"pg",lo:26.5,hi:33.5,main:1,m:"How much hemoglobin each red cell carries. Low often means low iron."},
  mchc:{n:"Red cell colour strength",t:"MCHC",u:"g/dL",lo:31.5,hi:35,main:1,m:"How rich the red cells are. Low again points to low iron."},
  rdw:{n:"Red cell size mix",t:"RDW",u:"%",lo:10,hi:15,main:1,m:"How much red cell sizes vary. Often high when iron is low."},
  plt:{n:"Clotting cells",t:"Platelets",u:"thousand/µL",lo:150,hi:390,main:1,m:"Help blood clot. Some arthritis medicines can lower them, so they are watched."},
  wbc:{n:"Infection fighters",t:"WBC, total white cells",u:"thousand/µL",lo:3.5,hi:10,main:1,m:"Cells that fight germs. High can mean inflammation, infection or steroids. Low can be a medicine side effect."},
  lym:{n:"Virus-fighting cells",t:"Lymphocytes",u:"%",lo:17,hi:48,main:1,m:"One type of infection fighter. Often drops after steroid tablets or injections."},
  gra:{n:"Germ-fighting cells",t:"Granulocytes / Neutrophils",u:"%",lo:43,hi:76,main:1,m:"Another type of infection fighter. Rises with infection, stress or steroids."},
  alt:{n:"Liver health 1",t:"SGPT / ALT",u:"IU/L",lo:5,hi:35,main:1,m:"Checks the liver. Watched closely with methotrexate, leflunomide and other arthritis medicines."},
  ast:{n:"Liver health 2",t:"SGOT / AST",u:"IU/L",lo:8,hi:40,main:1,m:"A second liver check."},
  cr:{n:"Kidney health",t:"Creatinine",u:"mg/dL",lo:0.6,hi:1.4,main:1,m:"Shows how well the kidneys clean the blood. Painkillers and methotrexate are watched with it."},
  alp:{n:"Liver and bone enzyme",t:"Alkaline phosphatase",u:"IU/L",lo:40,hi:130,m:"Part of the liver test; also rises with some bone problems."},
  bili:{n:"Yellow pigment",t:"Bilirubin (total)",u:"mg/dL",lo:0.2,hi:1.2,m:"High levels cause yellow eyes or skin (jaundice)."},
  alb:{n:"Blood protein",t:"Albumin",u:"g/dL",lo:3.5,hi:5.2,m:"Made by the liver. Low with long illness, poor diet or liver strain."},
  urea:{n:"Kidney waste",t:"Blood urea",u:"mg/dL",lo:15,hi:45,m:"Another kidney check, read with creatinine."},
  uric:{n:"Uric acid",t:"Uric acid",u:"mg/dL",lo:2.4,hi:6,m:"High uric acid causes gout, another kind of arthritis."},
  fbs:{n:"Sugar, fasting",t:"Fasting blood sugar",u:"mg/dL",lo:70,hi:100,m:"Sugar after an overnight fast. Steroids can raise it."},
  hba1c:{n:"Sugar, 3-month average",t:"HbA1c",u:"%",lo:4,hi:5.7,m:"Average sugar over 3 months. Watched with long-term steroids."},
  vitd:{n:"Vitamin D",t:"25-OH Vitamin D",u:"ng/mL",lo:30,hi:100,m:"Needed for strong bones. Often low in Indian women, and steroids make bones weaker."},
  ca:{n:"Calcium",t:"Serum calcium",u:"mg/dL",lo:8.5,hi:10.5,m:"Bone mineral. Too high can happen with too much vitamin D."},
  ferritin:{n:"Iron stores",t:"Ferritin",u:"ng/mL",lo:15,hi:150,m:"Shows how much iron the body has stored. The test that confirms low iron. Inflammation can push it up falsely."},
  b12:{n:"Vitamin B12",t:"Vitamin B12",u:"pg/mL",lo:200,hi:900,m:"Low B12 causes anemia, tingling and tiredness. Acidity tablets taken for years can lower it."},
  tsh:{n:"Thyroid",t:"TSH",u:"mIU/L",lo:0.4,hi:4.5,m:"Thyroid problems are more common with rheumatoid arthritis and can cause tiredness."},
  chol:{n:"Cholesterol",t:"Total cholesterol",u:"mg/dL",lo:0,hi:200,m:"Heart health. Some newer arthritis medicines raise it."}
};
