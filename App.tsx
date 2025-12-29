
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SlideData, MoodConfig } from './types';
import { MOODS, INITIAL_SLIDES } from './constants';
import { fetchPexelsImages } from './services/pexelsService';
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, Palette, Search, Maximize2, Minimize2, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [isFetching, setIsFetching] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodConfig>(MOODS[0]);
  const [showMoodMenu, setShowMoodMenu] = useState(false);
  
  // Wallpaper Mode state
  const [isWallpaperMode, setIsWallpaperMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const handleNext = useCallback(() => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      const first = newSlides.shift()!;
      newSlides.push(first);
      return newSlides;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      const last = newSlides.pop()!;
      newSlides.unshift(last);
      return newSlides;
    });
  }, []);

  // Slideshow logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWallpaperMode || isTimerActive) {
      interval = setInterval(() => {
        handleNext();
      }, timerSeconds * 1000);
    }
    return () => clearInterval(interval);
  }, [isWallpaperMode, isTimerActive, timerSeconds, handleNext]);

  const selectMood = async (mood: MoodConfig) => {
    setIsFetching(true);
    setShowMoodMenu(false);
    setCurrentMood(mood);
    
    try {
      const urls = await fetchPexelsImages(mood.promptPrefix, 5);
      const newSlides: SlideData[] = urls.map((url, index) => ({
        id: `pxl-${Date.now()}-${index}`,
        imageUrl: url,
        title: mood.label.toUpperCase(),
        subtitle: index === 0 ? 'MAIN SCENE' : `VIEW ${index + 1}`,
        description: `Experience the breathtaking ${mood.label.toLowerCase()} atmosphere curated from world-class photography. Every image captured to tell a unique story.`,
        mood: mood.name
      }));
      setSlides(newSlides);
    } catch (err) {
      console.error("Failed to fetch slides", err);
    } finally {
      setIsFetching(false);
    }
  };

  const activeSlide = slides[0];

  return (
    <div className={`relative w-screen h-screen bg-[#010101] overflow-hidden transition-all duration-1000 ${isWallpaperMode ? 'cursor-none' : ''}`}>
      {/* Background Main Image */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className={`w-full h-full object-cover transition-all duration-1000 ${isWallpaperMode ? 'brightness-100' : 'brightness-[0.4]'}`}
            />
            {/* Gradient Overlay - fades out in wallpaper mode */}
            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/20 transition-opacity duration-1000 ${isWallpaperMode ? 'opacity-0' : 'opacity-100'}`} />
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <nav className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 transition-all duration-500 ${isWallpaperMode ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100'}`}>
        <div className="text-2xl font-bold tracking-[5px] text-white">PEXELS CURATOR</div>
        <div className="flex gap-8 text-sm uppercase tracking-widest font-medium">
          <button className="hover:text-gray-400 transition-colors">Galleries</button>
          <button className="hover:text-gray-400 transition-colors">Artists</button>
          <button className="hover:text-gray-400 transition-colors">About</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-24 pointer-events-none transition-all duration-500 ${isWallpaperMode ? 'opacity-0 scale-95' : 'opacity-100'}`}>
        <div className="max-w-xl pointer-events-auto">
          <p className="text-sm font-bold tracking-[8px] text-white/70 uppercase mb-2 animate-content">
            {activeSlide.title}
          </p>
          <h1 
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 animate-content-delayed-1"
            style={{ color: currentMood.accentColor }}
          >
            {activeSlide.subtitle}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 animate-content-delayed-2">
            {activeSlide.description}
          </p>
          
          <div className="flex gap-4 animate-content-delayed-2">
            <button className="px-8 py-3 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-all active:scale-95">
              Explore Now
            </button>
            <button className="px-8 py-3 border border-white text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all active:scale-95">
              Save Set
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails (Bottom Right) */}
      <div className={`absolute bottom-16 right-12 z-20 flex gap-4 overflow-visible transition-all duration-500 ${isWallpaperMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
        {slides.slice(1).map((slide, index) => (
          <div
            key={slide.id}
            className="thumbnail-item relative w-32 h-48 md:w-40 md:h-56 rounded-2xl overflow-hidden cursor-pointer group shadow-2xl flex-shrink-0"
            onClick={handleNext}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{slide.title}</div>
              <div className="text-[10px] text-gray-400 font-medium">VIEW NEXT</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-4 items-center transition-all duration-500 ${isWallpaperMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handlePrev}
          className="p-3 border border-white/30 rounded-full hover:bg-white hover:text-black hover:border-white transition-all group"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 border border-white/30 rounded-full hover:bg-white hover:text-black hover:border-white transition-all group"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Controls */}
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 transition-all duration-500 ${isWallpaperMode ? 'translate-x-full opacity-0' : 'translate-x-0'}`}>
        
        {/* Wallpaper Toggle */}
        <button 
          onClick={() => setIsWallpaperMode(true)}
          className="p-4 bg-white/10 backdrop-blur-md rounded-l-2xl border-l border-t border-b border-white/20 hover:bg-white/20 transition-all flex flex-col items-center gap-2 group"
          title="Enter Wallpaper Mode"
        >
          <Maximize2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] text-[10px] tracking-[4px] font-bold uppercase">Zen Mode</span>
        </button>

        {/* Mood Selector Button */}
        <button 
          onClick={() => setShowMoodMenu(!showMoodMenu)}
          className="p-4 bg-white/10 backdrop-blur-md rounded-l-2xl border-l border-t border-b border-white/20 hover:bg-white/20 transition-all flex flex-col items-center gap-2 group"
        >
          {isFetching ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Palette className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          )}
          <span className="[writing-mode:vertical-lr] text-[10px] tracking-[4px] font-bold uppercase">
            {isFetching ? 'Fetching' : 'Theme'}
          </span>
        </button>

        {/* Floating Mood Menu */}
        {showMoodMenu && (
          <div className="absolute right-16 top-0 bg-black/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl w-64 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-[10px] font-bold tracking-[2px] uppercase text-gray-500 mb-4 px-2">Visual Experience</h3>
            
            <div className="mb-6 px-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/60">
                  <Clock className="w-3 h-3" /> Timer: {timerSeconds}s
                </div>
              </div>
              <input 
                type="range" 
                min="2" 
                max="30" 
                step="1"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood.name}
                  onClick={() => selectMood(mood)}
                  disabled={isFetching}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                    currentMood.name === mood.name ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">{mood.label}</span>
                  <div 
                    className="w-2 h-2 rounded-full transition-opacity"
                    style={{ 
                      backgroundColor: mood.accentColor,
                      opacity: currentMood.name === mood.name ? 1 : 0.3 
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 px-2">
               <button 
                onClick={() => selectMood(currentMood)}
                disabled={isFetching}
                className="w-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
               >
                 <RefreshCw className="w-3 h-3" /> Refresh Set
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Exit Wallpaper Mode Button (Visible on Hover in Wallpaper Mode) */}
      {isWallpaperMode && (
        <button 
          onClick={() => setIsWallpaperMode(false)}
          className="absolute top-8 right-8 z-[100] p-4 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white opacity-0 hover:opacity-100 transition-all duration-300"
          title="Exit Zen Mode"
        >
          <Minimize2 className="w-6 h-6" />
        </button>
      )}

      {/* Loading Overlay */}
      {isFetching && (
        <div className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative">
             <div className="w-28 h-28 border-2 border-white/10 border-t-white rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-8 h-8 text-white animate-pulse" />
             </div>
          </div>
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold tracking-[10px] uppercase mb-3">Curating Atmosphere</h2>
            <p className="text-gray-400 text-sm tracking-[3px] max-w-xs uppercase">
              Sourcing high-end {currentMood.label} imagery via Pexels
            </p>
          </div>
        </div>
      )}

      {/* Indicators */}
      <div className={`absolute bottom-8 left-12 z-20 flex gap-3 transition-opacity duration-500 ${isWallpaperMode ? 'opacity-0' : 'opacity-100'}`}>
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-[2px] transition-all duration-500 rounded-full ${i === 0 ? 'w-16' : 'w-4'}`}
            style={{ backgroundColor: i === 0 ? currentMood.accentColor : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
