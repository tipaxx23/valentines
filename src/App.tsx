import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import { Heart, Loader } from 'lucide-react';
import { FloatingHeart } from './components/FloatingHeart';
import { StoryScene } from './components/StoryScene';

function App() {
  const [loading, setLoading] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [name, setName] = useState('');
  const [showStory, setShowStory] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [heartFill, setHeartFill] = useState(0);

  const story = [
    {
      title: "Početak",
      text: "Draga posebna osobo, kada su nam se putevi ukrstili, znao sam da postoji nešto magično u tebi. Tvoj osmijeh mi uljepšava dan kao niko drugi.",
      color: "#ff6b6b"
    },
    {
      title: "Naše putovanje",
      text: "Svaki trenutak proveden s tobom osjećam kao prelijep san iz kojeg ne želim da se probudim. Tvoje prisustvo u mom životu čini sve ljepšim, ispunjenijim i smislenijim. Uz tebe, svaki dan dobija novu boju, toplinu i radost koju ranije nisam poznavao.",
      color: "#f06292"
    },
    {
      title: "Budučnost",
      text: `Ljubavna priča koja tek počinje, a svaki novi dan donosi novu stranicu ispunjenu srećom, uzbuđenjem i beskrajnom ljubavlju. Zajedno ćemo pisati svoje poglavlje života, ispunjeno osmijesima, nezaboravnim trenucima i avanturama koje će nas još više povezati. Naše putovanje tek počinje, a pred nama je bezbroj divnih uspomena koje ćemo stvoriti ruku pod ruku.`,
      color: "#e91e63"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowProposal(true), 1000);
    }, 2000);
  }, []);

  useEffect(() => {
    if (showFinal && heartFill < 100) {
      const timer = setInterval(() => {
        setHeartFill(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [showFinal, heartFill]);

  const handleAnswer = (answer: boolean) => {
    if (answer) {
      setAnswered(true);
      setTimeout(() => {
        setShowStory(true);
      }, 2000);
    }
  };

  const nextChapter = () => {
    if (currentChapter < story.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
      setShowStory(false);
      setShowFinal(true);
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const resetToStart = () => {
    setShowFinal(false);
    setShowProposal(true);
    setAnswered(false);
    setShowStory(false);
    setCurrentChapter(0);
    setHeartFill(0);
    setName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto" />
          <p className="text-red-600 text-xl font-semibold animate-pulse">Učitavanje specijalnog trenutka...</p>
          <p className="text-red-400 text-lg italic mt-8 animate-fade-in">Created by Timur</p>
        </div>
      </div>
    );
  }

  if (showFinal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-200 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl w-full">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <Heart 
              className="w-full h-full text-purple-500 absolute"
              fill="none"
              strokeWidth={1.5}
            />
            <Heart 
              className="w-full h-full text-purple-500 absolute transition-all duration-300"
              fill="currentColor"
              strokeWidth={1.5}
              style={{ clipPath: `inset(${100 - heartFill}% 0 0 0)` }}
            />
          </div>
          
          {heartFill === 100 && (
            <div className="animate-fadeIn space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 animate-float-y">
                Sretno Valentinovo ljubavi moja najljepša! ❤️
              </h1>
              <button
                onClick={resetToStart}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" /> Vrati me na početak
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-200 relative">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={false} enablePan={false} />
            {showStory && <StoryScene chapter={currentChapter} />}
            {Array.from({ length: 20 }).map((_, i) => (
              <FloatingHeart key={i} position={[
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
              ]} />
            ))}
          </Suspense>
        </Canvas>
      </div>

      <div className={`relative z-10 min-h-screen flex items-center justify-center transition-opacity duration-1000 
        ${showProposal ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl w-full mx-auto p-4 sm:p-8">
          {!answered ? (
            <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 card-3d">
              <h1 className="text-3xl sm:text-5xl font-bold text-red-600 mb-8 animate-float-y drop-shadow-glow text-center">
                Hoćeš li biti moje Valentinovo? 💖
              </h1>
              
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Unesi svoje ime..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 rounded-lg bg-white/50 backdrop-blur-sm border-2 border-pink-300 focus:border-pink-500 outline-none text-lg text-pink-800 placeholder-pink-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Heart className="w-6 h-6" fill="currentColor" />
                  Da! želim to
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full sm:w-auto px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transform hover:translate-x-20 hover:opacity-0 transition-all duration-300"
                >
                  Ne.. izvini
                </button>
              </div>
            </div>
          ) : showStory ? (
            <div className="bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 card-3d">
              <h1 className="text-3xl sm:text-5xl font-bold text-red-600 mb-8 animate-float-y drop-shadow-glow">
                {story[currentChapter].title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-pink-800 leading-relaxed font-serif animate-fadeIn mb-8">
                {story[currentChapter].text}
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={previousChapter}
                  disabled={currentChapter === 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg ${
                    currentChapter === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600'
                  } text-white font-semibold transition-colors`}
                >
                  Prethodni tekst
                </button>

                <div className="flex space-x-2">
                  {story.map((_, index) => (
                    <Heart
                      key={index}
                      className={`w-6 h-6 ${
                        index === currentChapter ? 'text-red-500 scale-125' : 'text-pink-300'
                      } transition-all duration-300`}
                      fill={index <= currentChapter ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>

                <button
                  onClick={nextChapter}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors"
                >
                  {currentChapter === story.length - 1 ? 'Završi' : 'Nastavi'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-2xl transform scale-105 transition-all duration-1000 card-3d text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-red-600 mb-8 animate-float-y drop-shadow-glow">
                Hvala ti, {name}! ❤️
              </h1>
              <p className="text-2xl sm:text-3xl text-pink-800">
                Ti si me učinila najsretnijom osobom na svijetu!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;