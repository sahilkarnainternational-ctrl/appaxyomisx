const fs = require('fs');
const path = require('path');

const subjects = [
  { name: 'Physics', topics: ['Quantum Mechanics', 'Thermodynamics', 'Electromagnetism', 'Classical Dynamics', 'Nuclear Physics', 'Relativity', 'Astrophysics', 'Optics'] },
  { name: 'Biology', topics: ['Molecular Genetics', 'Cellular Biology', 'Anatomy', 'Immunology', 'Evolution', 'Ecology', 'Botany', 'Zoology'] },
  { name: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Materials Science', 'Electrochemistry', 'Chemical Kinetics'] }
];

const difficulties = ['kids', 'entry-level', 'mid-tier', 'advanced'];

const templates = [
  { q: "What is the primary function of {topic} in the context of {subject}?", o: ["To regulate fundamental interactions", "To stabilize the structural integrity of the system", "To facilitate dynamic equilibrium", "To catalyze instantaneous reactions"] },
  { q: "Which of the following best describes a key principle of {topic}?", o: ["Conservation of mass and energy over time", "The probabilistic nature of subatomic particles", "Continuous variation without discrete boundaries", "Absolute deterministic predictability"] },
  { q: "In {subject}, how does {topic} influence theoretical models?", o: ["By providing a rigorous mathematical framework", "By eliminating the need for empirical observation", "By oversimplifying complex interactions", "By restricting models to classical mechanics"] },
  { q: "What phenomenon is fundamentally explained by {topic}?", o: ["The wave-particle duality and uncertainty", "The macroscopic formation of crystalline structures", "The metabolic pathways in simple organisms", "The oxidation states of transition metals"] },
  { q: "Which scientist is most famously associated with foundational discoveries in {topic}?", o: ["Albert Einstein / Max Planck", "Isaac Newton", "Gregor Mendel", "Dmitri Mendeleev"] },
  { q: "What is the standard unit or parameter most commonly evaluated in {topic}?", o: ["Joules per Kelvin", "Newtons", "Molar Mass", "Base Pairs"] },
  { q: "When analyzing {topic}, what is typically the first constraint applied to the system?", o: ["Assuming a closed or isolated system", "Ignoring relativistic effects", "Assuming infinite volume", "Setting temperature to absolute zero"] },
  { q: "Which modern technology relies heavily on the principles of {topic}?", o: ["Magnetic Resonance Imaging (MRI)", "Traditional Combustion Engines", "Analog Barometers", "Manual Centrifuges"] },
];

const kidsTemplates = [
  { q: "What is the study of {topic} mainly about in {subject}?", o: ["Understanding how things work", "Playing with toys", "Eating healthy food", "Sleeping well"] },
  { q: "Which word best describes {topic}?", o: ["Amazing", "Boring", "Spooky", "Salty"] },
  { q: "Why is {topic} so cool in {subject}?", o: ["It helps us discover the world!", "It does nothing.", "It makes us tired.", "It is a type of dance."] },
  { q: "How does {topic} help us everyday?", o: ["It makes modern tools work", "It eats our homework", "It tells us jokes", "It paints pictures"] }
];

const quiz = [];
let idCounter = 1;

for (let i = 0; i < 500; i++) {
  const subject = subjects[i % subjects.length];
  const topic = subject.topics[Math.floor(Math.random() * subject.topics.length)];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  const templatePool = difficulty === 'kids' ? kidsTemplates : templates;
  const template = templatePool[Math.floor(Math.random() * templatePool.length)];

  
  let question = template.q.replace('{topic}', topic).replace('{subject}', subject.name);
  let options = [...template.o];
  
  for (let k = options.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [options[k], options[j]] = [options[j], options[k]];
  }
  
  const correctIndex = options.indexOf(template.o[0]);

  let explanation = `The correct answer is "${template.o[0]}". `;
  if (difficulty === 'kids') {
    explanation += `Keep exploring the amazing world of ${topic} in ${subject.name}!`;
  } else {
    explanation += `This is a fundamental concept for understanding ${topic} within ${subject.name}.`;
  }

  quiz.push({
    id: `axyomis_${subject.name.substring(0,3).toLowerCase()}_${idCounter.toString().padStart(3, '0')}`,
    category: subject.name.toLowerCase(),
    subcategory: topic.toLowerCase().replace(' ', '_'),
    difficulty,
    question,
    options,
    correct_index: correctIndex,
    explanation
  });
  idCounter++;
}

fs.writeFileSync(path.join(__dirname, 'data', 'axyomis_full_quiz.json'), JSON.stringify(quiz, null, 2));
console.log('Done');
