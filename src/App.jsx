import React from 'react';
import { Github, Mail, ExternalLink, Linkedin } from 'lucide-react';
import PathfindingGame from './pathfinding.jsx';

function App() {
  const personalInfo = {
    name: "Hi, I'm Julio.",
    title: "This is my portfolio. Look here for some of my stuff.",
    about: "Some C++, some Python, some Kotlin... Some ML, some LLM, some genetic algorithms... Some containers, some AWS, some media streaming from scratch... Cool projects I think.",
    email: "julioantonio.fresnedagarcia@gmail.com",
    githubUsername: "JulioFresneda",
    linkedinUsername: "julio-fresneda"
  };

  const projects = [

    {
      name: "GhostStream",
      description: "Don't be scared! Some ghosts are cute. This project was born out of a collapse of motivations within myself. I always thought it would be cool as hell to have a private \"Netflix\" app where no movie or series is ever removed, and everything I want is always available. My future son will not watch any fucking Disney Channel cartoons; instead, he will watch Goten being completely beaten the shit out of by Cell, which is, of course, much healthier content for a kid.",
      tags: ["C++", "Qt", "LibVLC", "DASH Streaming"],
      repoUrl: "https://github.com/JulioFresneda/GhostStream",
      imageUrl: "https://github.com/JulioFresneda/GhostStream/blob/main/screenshots/header.png?raw=true" // Replace with your actual image
    },
    {
      name: "Speak2Subs",
      description: "Real-time speech-to-subtitle converter. Subtitles generation is not the same as speech to text. Keep in mind that subtitles has timestamps and has to be legible. Speak2Subs has three fundamental features: subtitle generation based on a reference template, subtitle quality evaluation, and subtitle generation without a reference template. This readme provides a concise introduction to each of these features, while subsequent sections describe the installation process, usage, and internal mechanics in more detail.",
      tags: ["Python", "Speech Recognition", "NLP", "Docker containers", "LLM"],
      repoUrl: "https://github.com/JulioFresneda/Speak2Subs",
      imageUrl: "https://github.com/JulioFresneda/Speak2Subs/raw/main/packageresume.png" // Replace with your actual image
    },
    
    {
      name: "AutoActa",
      description: "Automation tool that streamlines the creation of meeting minutes and documentation. Features smart formatting, template management, and support for multiple document formats.",
      tags: ["Python", "Automation", "Doc Processing"],
      repoUrl: "https://github.com/JulioFresneda/AutoActa",
      imageUrl: "https://raw.githubusercontent.com/JulioFresneda/AutoActa/refs/heads/master/screenshot.jpeg" // Replace with your actual image
    },
    {
      name: "PadelClips",
      description: "Auto detect best minutes of a match. Currently on developing.",
      tags: ["Python", "OpenCV", "ML", "Sports Analytics"],
      repoUrl: "https://github.com/JulioFresneda/PadelClips",
      imageUrl: "/api/placeholder/800/400" // Replace with your actual image
    },
    {
      name: "HellsDriver",
      description: "Videogame focused on AI of vehicles. Neural networks coded from scratch (no libraries of any kind), evolved using NEAT genetic algorithm. Cool game.",
      tags: ["Unity", "C#", "Genetic Algorithms", "Neural Networks from scratch"],
      repoUrl: "https://github.com/JulioFresneda/HellsDriver",
      imageUrl: "https://github.com/juliofgx17/HellsDriver-TFG/raw/master/capturas/imagen4.jpg" // Replace with your actual image
    }
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-blue-300 to-black text-white py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:5px_5px]"></div>

      {/* Header Section */}
      <header className="bg-gradient-to-r from-black via-blue-900 to-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:5px_5px]"></div>
        <div className="max-w-6xl mx-auto text-center px-8 relative">
          <PathfindingGame />
          <h1 className="text-6xl pt-14 font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            {personalInfo.name}
          </h1>
          <p className="text-2xl text-blue-200 mb-4">{personalInfo.title}</p>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">{personalInfo.about}</p>
          
          <div className="flex justify-center gap-6">
            
            <a 
              href={`https://github.com/${personalInfo.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-lg backdrop-blur-sm text-white"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <a 
              href={`https://linkedin.com/in/${personalInfo.linkedinUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-lg backdrop-blur-sm text-white"
            >
              <Linkedin className="h-5 w-5 text-white" />
              <span>LinkedIn</span>
            </a>
            <a 
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-lg backdrop-blur-sm text-white"
            >
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </header>

      

      {/* Projects Section */}
      <main className="max-w-6xl mx-auto py-24 px-4 " >
        
        <div className="grid grid-cols-1 gap-12">
          {projects.map((project) => (
            <div 
              key={project.name}
              className="group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100"
            >
              <div className="relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.name}
                  className="w-full h-96 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/90 text-gray-900 px-6 py-3 rounded-lg hover:bg-white transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {project.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      
    </div>
  );
}

export default App;