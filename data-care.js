/* ==========================================================================
   NATURAL WAYS TO HELP (no prescription needed)
   Cards are ranked automatically: a card moves up when one of its "tests" is
   outside the healthy range, or when she takes a medicine listed in medNote or
   in that medicine's "care" list (data-medicines.js).
   Hindi text lives in i18n-hi.js (section "care").

   id       short code (never change an existing id)
   tests    test ids that make this card relevant
   always   true = always useful, kept near the top
   wide     true = full-width card shown first
   intro    a short paragraph
   items    bullet points
   exercises  [name, how to do it, how much]
   extra    a closing paragraph
   medNote  medicine key -> a note shown only when she takes that medicine
   limit    what this cannot replace
   ========================================================================== */
window.AT = window.AT || {};
AT.CARE = [
 {id:"exercise",title:"Gentle knee exercises",tests:["crp","esr"],always:true,wide:true,
  intro:"Regular exercise is the strongest lifestyle advice from the American College of Rheumatology. Start small and stop if pain is sharp. Mild soreness that settles within 2 hours is fine.",
  exercises:[
   ["Knee press","Sit with the leg straight. Press the back of the knee down into the bed and hold.","10 times, 5 sec, twice a day"],
   ["Straight leg lift","Lie down with the other knee bent. Lift the straight leg to the height of the bent knee.","2 sets of 10, each leg"],
   ["Heel slide","Lie down. Slowly bend and straighten the knee by sliding the heel along the bed.","10 slow, each leg"],
   ["Chair leg straightening","Sit on a chair. Straighten one knee, hold, then lower it slowly.","10 times, 3 sec, each leg"],
   ["Stand up from a chair","Use the armrests at first. Builds thigh strength for daily life.","5 to 10, once a day"],
   ["Short walks on flat ground","Several short walks beat one long one. Avoid stairs and squatting while the knee is swollen.","10 min, 3 times a day"]
  ],
  extra:"On a bad day (knee hot and swollen): gentle bending only, a cold pack wrapped in cloth for 10 to 15 minutes, and rest. For morning stiffness: a warm compress or warm bath first.",
  limit:"Cannot replace medicine that stops joint damage. Exercise helps pain and strength, but untreated arthritis can still harm the joint."},
 {id:"diet",title:"A calming Indian vegetarian plate",tests:["crp","esr"],
  items:["Whole grains daily: bajra, jowar, whole-wheat roti.","Dal, chana, rajma or moong at two meals.","Half the plate vegetables, plus 2 fruits a day.","A few walnuts or a spoon of ground alsi (flaxseed). Haldi in cooking is fine.","Less sweets, sugary tea, namkeen, fried snacks and maida."],
  limit:"Food helps a little, but it will not bring inflammation down the way arthritis medicine does."},
 {id:"iron",title:"More iron, better absorbed",tests:["hb","mcv","mch","mchc","rdw","ferritin"],
  items:["Iron foods: bathua, methi, palak, chana, rajma, masoor, til, gur, dates, poha.","Eat them with lemon, amla, guava or orange; vitamin C helps the body take in iron.","Keep tea and coffee at least 1 hour away from meals.","Cooking in an iron kadhai adds a little iron."],
  medNote:{iron:"She takes an iron tablet: give it with lemon water, never with tea, milk or a calcium tablet.",ppi:"Her acidity tablet can lower iron and B12 absorption over years. Worth asking the doctor if it is still needed."},
  limit:"Cannot replace an iron test (ferritin). If iron is low she will likely need iron tablets or an injection, which the doctor decides."},
 {id:"bones",title:"Sunlight, calcium and strong bones",tests:["vitd","ca"],
  items:["15 to 20 minutes of sun on arms and face, late morning, most days.","Calcium from curd, milk, paneer, ragi and til.","Standing and walking exercise keeps bones strong.","If she is overweight, slow weight loss takes load off the knees."],
  medNote:{steroid:"Steroids thin the bones. Ask the doctor about vitamin D, calcium and a bone scan (DEXA).",cad:"She already takes calcium and vitamin D: the 60,000 unit sachet is weekly or monthly, never daily."},
  limit:"Cannot replace a vitamin D test before high-dose vitamin D."},
 {id:"sugar",title:"Keep sugar steady",tests:["fbs","hba1c"],
  items:["A 10 to 15 minute slow walk after the main meals.","Swap sweets and sugary tea for fruit, roasted chana or buttermilk.","Fill half the plate with vegetables; keep rice and roti portions moderate."],
  medNote:{steroid:"Steroids raise blood sugar. Ask the doctor to check fasting sugar or HbA1c."},
  limit:"Cannot replace a sugar test, or diabetes medicine if the doctor prescribes it."},
 {id:"liver",title:"Protect the liver",tests:["alt","ast","alp","bili"],
  items:["No alcohol at all, especially with arthritis medicines.","No unregulated herbal or desi products.","Do not take extra paracetamol beyond what the doctor says; count combination tablets too."],
  medNote:{mtx:"She takes methotrexate: folic acid as prescribed and no alcohol protect the liver.",lef:"She takes leflunomide: no alcohol, and keep the liver tests on schedule."},
  limit:"Cannot replace the regular liver blood tests her medicines need."},
 {id:"kidney",title:"Look after the kidneys",tests:["cr","urea"],
  items:["Drink enough water through the day (urine should be pale).","No daily painkillers like diclofenac or ibuprofen without the doctor knowing.","Keep salt and pickles moderate if blood pressure is high."],
  medNote:{nsaid:"She takes a painkiller (NSAID): drink enough water and ask the doctor how long she should take it."},
  limit:"Cannot replace kidney blood tests while on painkillers or methotrexate."},
 {id:"sleep",title:"Sleep and calm",tests:[],always:true,
  items:["Same bedtime and wake-up time daily, 7 to 8 hours.","10 minutes of slow breathing or gentle chair yoga. Skip deep knee bends and sitting cross-legged while the knee is swollen.","Mix active tasks with rest through the day."],
  limit:"Rest helps tiredness and pain; it does not treat the cause."},
 {id:"cannot",title:"Results food or exercise cannot change",tests:["rf","accp","wbc","lym","gra"],
  items:["The arthritis antibodies (RF, anti-CCP) help the doctor confirm the type of arthritis. They do not show whether she is getting better, so the page sets no goal for them.","The white cell mix often changes after steroid tablets, pain injections or an infection. Tell the doctor about any medicine she took between reports."],
  limit:""}
];
