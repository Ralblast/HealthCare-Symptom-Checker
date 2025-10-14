import MedicalCondition from '../models/MedicalCondition.js';
import logger from '../utils/logger.js';


export async function seedMedicalData() {
  try {
    const count = await MedicalCondition.countDocuments();
    
    if (count > 0) {
      logger.info('Database already seeded', { count });
      return;
    }

    logger.info('Seeding medical knowledge base...');

    const conditions = [
      {
        condition: "Common Cold",
        symptoms: [
          "runny nose", "stuffy nose", "sore throat", "cough", 
          "congestion", "mild headache", "sneezing", "mild fever",
          "watery eyes", "fatigue"
        ],
        description: "The common cold is a viral infection of the upper respiratory tract. It's usually harmless and symptoms typically improve within 7-10 days. Caused by various viruses, most commonly rhinoviruses.",
        recommendations: [
          "Get plenty of rest (7-9 hours of sleep)",
          "Stay well hydrated with water, herbal tea, and warm liquids",
          "Use over-the-counter medications for symptom relief (acetaminophen, ibuprofen)",
          "Gargle with warm salt water for sore throat (1/2 tsp salt in 8 oz water)",
          "Use a humidifier to ease congestion",
          "Wash hands frequently to prevent spreading",
          "If symptoms persist beyond 10 days, worsen, or include high fever (>101.5°F), consult a doctor"
        ],
        source: "CDC - Centers for Disease Control and Prevention",
        severity: "low"
      },
      {
        condition: "Influenza (Flu)",
        symptoms: [
          "high fever", "body aches", "fatigue", "headache", 
          "sore throat", "dry cough", "runny nose", "chills",
          "sweating", "muscle pain", "weakness"
        ],
        description: "Influenza is a contagious respiratory illness caused by influenza viruses. It can cause mild to severe illness and can lead to hospitalization or death in high-risk groups. Flu season typically runs from October to May.",
        recommendations: [
          "Rest and get plenty of sleep (at least 8 hours)",
          "Drink lots of fluids (water, broth, sports drinks)",
          "Take antiviral medications if prescribed within 48 hours of symptom onset",
          "Use pain relievers and fever reducers (acetaminophen, ibuprofen)",
          "Stay home to avoid spreading the virus (isolate for at least 24 hours after fever subsides)",
          "Cover coughs and sneezes",
          "Seek immediate medical care if you experience: difficulty breathing, chest pain, persistent vomiting, confusion, or severe weakness"
        ],
        source: "NHS - National Health Service & WHO",
        severity: "medium"
      },
      {
        condition: "Migraine",
        symptoms: [
          "severe headache", "throbbing pain", "pulsating pain",
          "sensitivity to light", "sensitivity to sound", "nausea", 
          "vomiting", "visual disturbances", "aura", "dizziness"
        ],
        description: "A migraine is a neurological condition characterized by intense, debilitating headaches. Episodes typically last 4-72 hours. Often accompanied by visual disturbances (aura) before onset. Affects approximately 15% of the global population.",
        recommendations: [
          "Rest in a quiet, dark room immediately when symptoms start",
          "Apply cold compress or ice pack to forehead or back of neck",
          "Take prescribed migraine medications (triptans, NSAIDs) at first sign",
          "Practice relaxation techniques and deep breathing",
          "Identify and avoid personal triggers (certain foods, stress, lack of sleep, bright lights)",
          "Maintain regular sleep schedule (same bedtime/wake time)",
          "Stay hydrated and eat regular meals",
          "Consult a neurologist for recurring migraines or if pain is severe and unresponsive to medication",
          "Keep a migraine diary to track triggers and patterns"
        ],
        source: "Mayo Clinic & American Migraine Foundation",
        severity: "medium"
      },
      {
        condition: "Seasonal Allergies (Hay Fever)",
        symptoms: [
          "sneezing", "runny nose", "itchy eyes", "watery eyes", 
          "nasal congestion", "postnasal drip", "itchy throat",
          "itchy nose", "coughing", "fatigue"
        ],
        description: "Seasonal allergic rhinitis (hay fever) occurs when the immune system overreacts to outdoor allergens such as pollen from trees, grass, and weeds. Symptoms are seasonal and coincide with pollen counts.",
        recommendations: [
          "Take antihistamines as needed (cetirizine, loratadine, fexofenadine)",
          "Use nasal corticosteroid sprays for persistent symptoms",
          "Keep windows closed during high pollen days (check daily pollen count)",
          "Shower and change clothes after being outdoors",
          "Use air purifiers with HEPA filters indoors",
          "Wear sunglasses outdoors to protect eyes",
          "Avoid outdoor activities during peak pollen times (early morning and evening)",
          "Consider allergy testing if symptoms are severe or year-round",
          "Discuss immunotherapy (allergy shots) with allergist for long-term relief"
        ],
        source: "American Academy of Allergy, Asthma & Immunology (AAAAI)",
        severity: "low"
      },
      {
        condition: "Asthma Attack",
        symptoms: [
          "shortness of breath", "wheezing", "chest tightness", 
          "persistent coughing", "difficulty breathing", "rapid breathing",
          "difficulty speaking", "bluish lips", "anxiety"
        ],
        description: "Asthma is a chronic respiratory condition where airways become inflamed and narrowed. During an attack, airways produce excess mucus, making breathing extremely difficult. Can be triggered by allergens, exercise, cold air, or stress.",
        recommendations: [
          "Use rescue inhaler (albuterol) immediately - 2 puffs, wait 1 minute, repeat if needed",
          "Sit upright - do NOT lie down",
          "Try to stay calm and breathe slowly and steadily",
          "Loosen tight clothing around neck and chest",
          "If no improvement after using inhaler OR symptoms worsen, call emergency services (911) immediately",
          "Follow your personalized asthma action plan",
          "Work with your doctor to identify and avoid triggers",
          "Take controller medications as prescribed daily, even when feeling well",
          "Monitor peak flow regularly",
          "Get annual flu shots to prevent respiratory infections"
        ],
        source: "National Heart, Lung, and Blood Institute (NHLBI)",
        severity: "high"
      },
      {
        condition: "Type 2 Diabetes Warning Signs",
        symptoms: [
          "increased thirst", "frequent urination", "extreme fatigue", 
          "blurred vision", "slow healing sores", "unexplained weight loss",
          "increased hunger", "tingling hands or feet", "dark skin patches",
          "frequent infections"
        ],
        description: "Type 2 diabetes is a chronic metabolic condition affecting how the body processes blood glucose (sugar). The body either resists insulin or doesn't produce enough. Can lead to serious complications if untreated, including heart disease, kidney damage, and vision loss.",
        recommendations: [
          "Schedule blood sugar testing with your doctor immediately (fasting glucose, HbA1c)",
          "Monitor your diet - focus on whole grains, lean proteins, vegetables",
          "Limit refined carbohydrates and sugary foods/drinks",
          "Increase physical activity to 150 minutes per week (walking, swimming, cycling)",
          "Aim for gradual weight loss if overweight (5-10% reduction can significantly improve outcomes)",
          "Check feet daily for cuts or sores",
          "Monitor blood pressure regularly",
          "If diagnosed, take prescribed medications consistently",
          "Learn to check blood sugar at home",
          "Work with diabetes educator and dietitian",
          "Get regular eye exams and kidney function tests"
        ],
        source: "American Diabetes Association (ADA) & CDC",
        severity: "medium"
      },
      {
        condition: "Gastroenteritis (Stomach Flu)",
        symptoms: [
          "diarrhea", "nausea", "vomiting", "stomach cramps",
          "abdominal pain", "low-grade fever", "headache",
          "muscle aches", "dehydration", "loss of appetite"
        ],
        description: "Gastroenteritis is inflammation of the stomach and intestines, typically caused by viral or bacterial infection. Common causes include norovirus, rotavirus, and food poisoning. Usually resolves within 1-3 days.",
        recommendations: [
          "Stay hydrated - drink small sips of water, oral rehydration solutions, clear broths",
          "Rest and avoid solid foods initially",
          "Gradually reintroduce bland foods (BRAT diet: bananas, rice, applesauce, toast)",
          "Avoid dairy, caffeine, alcohol, and fatty foods until recovered",
          "Wash hands frequently with soap and water",
          "Disinfect contaminated surfaces",
          "Seek medical care if: severe dehydration, blood in stool/vomit, high fever (>101.5°F), symptoms persist >3 days, or unable to keep fluids down"
        ],
        source: "Mayo Clinic & CDC",
        severity: "medium"
      },
      {
        condition: "Anxiety Disorder",
        symptoms: [
          "excessive worry", "restlessness", "fatigue", "difficulty concentrating",
          "irritability", "muscle tension", "sleep disturbances",
          "rapid heartbeat", "sweating", "trembling", "panic attacks"
        ],
        description: "Anxiety disorders involve persistent, excessive worry that interferes with daily activities. Can manifest as generalized anxiety disorder (GAD), panic disorder, or social anxiety. Affects approximately 18% of adults annually.",
        recommendations: [
          "Practice deep breathing exercises (4-7-8 technique, box breathing)",
          "Engage in regular physical exercise (30 minutes daily)",
          "Maintain consistent sleep schedule (7-9 hours)",
          "Limit caffeine and alcohol intake",
          "Practice mindfulness meditation or progressive muscle relaxation",
          "Talk to a mental health professional (therapist, counselor, psychiatrist)",
          "Consider cognitive-behavioral therapy (CBT) - proven effective treatment",
          "Join support groups for anxiety management",
          "If symptoms are severe or interfere with daily life, consult a doctor about medication options",
          "Crisis hotline: 988 (Suicide & Crisis Lifeline) available 24/7"
        ],
        source: "National Institute of Mental Health (NIMH) & Anxiety and Depression Association of America (ADAA)",
        severity: "medium"
      }
    ];

    const result = await MedicalCondition.insertMany(conditions);
    logger.info('Medical knowledge base seeded successfully', { count: result.length });
    
  } catch (error) {
    logger.error('Error seeding database', error);
    throw error;
  }
}
