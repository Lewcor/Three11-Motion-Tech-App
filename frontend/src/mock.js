// Mock data for AI-Powered Caption & Hashtag Generator for Creators
export const mockData = {
  contentCategories: [
    { id: 'fashion', name: 'Fashion', icon: '👗', color: 'bg-pink-500' },
    { id: 'fitness', name: 'Fitness', icon: '💪', color: 'bg-green-500' },
    { id: 'food', name: 'Food', icon: '🍕', color: 'bg-orange-500' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-blue-500' },
    { id: 'business', name: 'Business', icon: '💼', color: 'bg-gray-500' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', color: 'bg-purple-500' },
    { id: 'music', name: 'Music', icon: '🎵', color: 'bg-red-500' },
    { id: 'ideas', name: 'Ideas', icon: '💡', color: 'bg-yellow-500' },
    { id: 'event_space', name: 'Event Space', icon: '🏛️', color: 'bg-indigo-500' }
  ],

  platforms: [
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-black' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-600' }
  ],

  aiProviders: [
    { id: 'openai', name: 'OpenAI GPT', icon: '🤖', color: 'bg-green-600' },
    { id: 'anthropic', name: 'Anthropic Claude', icon: '🧠', color: 'bg-orange-600' },
    { id: 'gemini', name: 'Google Gemini', icon: '💎', color: 'bg-blue-600' }
  ],

  // Mock generated content
  mockCaptions: {
    fashion: {
      openai: [
        "✨ Stepping into the weekend like... Who else is obsessed with this look? 💫",
        "When your outfit speaks louder than words 🔥 What's your go-to confidence piece?",
        "Plot twist: This entire look was under $50 💰 Proving style doesn't break the bank!"
      ],
      anthropic: [
        "Fashion is art you can wear, and today I'm feeling like a masterpiece 🎨",
        "Confidence level: Wearing this outfit to the grocery store ✨",
        "Some days you need the outfit to match the energy you're manifesting 💫"
      ],
      gemini: [
        "Current mood: Main character energy in every room I enter 👑",
        "This outfit said 'wear me' and I listened 📢 Sometimes the clothes choose you!",
        "Serving looks and taking names 💅 What's your power outfit?"
      ]
    },
    fitness: {
      openai: [
        "🔥 30 minutes of movement = 24 hours of feeling unstoppable! Who's training today?",
        "Sweat today, shine tomorrow ✨ Remember: progress over perfection always!",
        "Your body can do it. It's your mind you need to convince 💪 #MindsetMonday"
      ],
      anthropic: [
        "Fitness isn't about being perfect, it's about being consistent 🎯",
        "Every workout brings you closer to the person you're becoming 🌟",
        "Strong is the new beautiful, and you're already there 💪"
      ],
      gemini: [
        "Training update: Still showing up, still getting stronger 📈",
        "Reminder: You've survived 100% of your hardest workouts 🏆",
        "Building the body that carries my dreams 💫 What's your why?"
      ]
    },
    music: {
      openai: [
        "🎵 When words fail, music speaks. This track hits different... What's on your playlist?",
        "Creating melodies that tell stories words can't capture 🎶",
        "Music is the universal language of the soul 🌍 Drop your current obsession below!"
      ],
      anthropic: [
        "Every song is a three-minute movie, and I'm here for the storytelling 🎬",
        "Found my new anthem for the week 🎵 Sometimes you need that one song to change everything",
        "Music isn't just sound, it's emotion with a beat 💫"
      ],
      gemini: [
        "This melody lives in my head rent-free 🏠 What songs are stuck in yours?",
        "When life gets complicated, turn up the music 🔊",
        "Creating soundtracks for moments that don't exist yet 🎵"
      ]
    },
    ideas: {
      openai: [
        "💡 Plot twist incoming... What if your biggest fear is actually your biggest opportunity?",
        "Every story starts with 'What if?' - What's your what if? ✨",
        "Writing characters who feel more real than some people I know 📚"
      ],
      anthropic: [
        "Ideas are like seeds - they need the right conditions to grow 🌱",
        "Sometimes the best stories come from the worst days 📖",
        "Creativity is intelligence having fun 🎨 What's your creative outlet?"
      ],
      gemini: [
        "Turning coffee into characters and dreams into dialogue ☕",
        "The best ideas come when you're not actively looking for them 💭",
        "Writing is rewriting, and rewriting is where the magic happens ✨"
      ]
    },
    event_space: {
      openai: [
        "🏛️ Where memories are made and dreams come true... Your perfect event starts here!",
        "Every celebration deserves a space as special as the moment ✨ What's your vision?",
        "Transform your event from ordinary to extraordinary in our stunning venue 🎉"
      ],
      anthropic: [
        "The right space doesn't just host events - it elevates them 🌟",
        "Creating atmospheres where every guest feels the magic ✨",
        "Your event is unique, and so should be your venue 🏛️"
      ],
      gemini: [
        "Picture perfect moments happen in picture perfect places 📸",
        "Where elegance meets functionality - your event space awaits 🎭",
        "From intimate gatherings to grand celebrations - we've got the perfect space 🎊"
      ]
    }
  },

  mockHashtags: {
    fashion: [
      "#OOTD", "#FashionInspo", "#StyleBlogger", "#Fashionista", "#OutfitGoals",
      "#FashionTrends", "#StyleTips", "#FashionDaily", "#Trendy", "#StyleGuide",
      "#FashionPost", "#WardrobeEssentials", "#FashionLover", "#StyleInspiration", "#ChicStyle"
    ],
    fitness: [
      "#FitnessMotivation", "#WorkoutTime", "#FitLife", "#GymLife", "#HealthyLiving",
      "#FitnessJourney", "#StrongNotSkinny", "#FitnessTips", "#WorkoutWednesday", "#TrainHard",
      "#FitnessGoals", "#HealthyLifestyle", "#FitnessInspiration", "#SweatEquity", "#FitFam"
    ],
    music: [
      "#MusicIsLife", "#NewMusic", "#MusicLover", "#SongOfTheDay", "#MusicVibes",
      "#IndieMusic", "#MusicProducer", "#Songwriter", "#MusicVideo", "#LiveMusic",
      "#MusicDaily", "#SoundCloud", "#MusicTips", "#MusicCreator", "#BeatMaker"
    ],
    ideas: [
      "#CreativeWriting", "#WritingCommunity", "#BookWriter", "#Screenplay", "#WritingTips",
      "#AuthorLife", "#WritingInspiration", "#StoryTelling", "#WritingProcess", "#BookLovers",
      "#WritingMotivation", "#CreativeIdeas", "#WritingChallenge", "#IndieAuthor", "#WritingLife"
    ],
    event_space: [
      "#EventSpace", "#VenueRental", "#EventVenue", "#PartySpace", "#WeddingVenue",
      "#CorporateEvents", "#EventPlanning", "#VenueHire", "#EventDesign", "#CelebrationSpace",
      "#EventLocation", "#VenueBooking", "#PrivateEvents", "#EventProfs", "#VenueOwner"
    ]
  },

  premiumPacks: [
    {
      id: 'fashion-luxury',
      name: 'Luxury Fashion Pack',
      category: 'fashion',
      price: '$4.99',
      features: ['High-end brand captions', 'Designer hashtags', 'Fashion week style'],
      premium: true
    },
    {
      id: 'fitness-pro',
      name: 'Pro Athlete Pack',
      category: 'fitness',
      price: '$3.99',
      features: ['Professional training content', 'Athlete-level captions', 'Competition hashtags'],
      premium: true
    },
    {
      id: 'music-producer',
      name: 'Music Producer Pack',
      category: 'music',
      price: '$5.99',
      features: ['Studio session captions', 'Producer hashtags', 'Music industry insights'],
      premium: true
    },
    {
      id: 'writer-pro',
      name: 'Professional Writer Pack',
      category: 'ideas',
      price: '$6.99',
      features: ['Author-level content', 'Publishing hashtags', 'Creative writing prompts'],
      premium: true
    }
  ],

  userLimits: {
    free: {
      dailyGenerations: 10,
      used: 3,
      features: ['Basic captions', 'Standard hashtags', 'All platforms']
    },
    premium: {
      dailyGenerations: 'Unlimited',
      used: 47,
      features: ['Premium captions', 'Trending hashtags', 'AI combination', 'Premium packs', 'Priority support']
    }
  }
};

// Mock API functions
export const mockAPI = {
  generateCaption: async (category, platform, userInput) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    const captions = mockData.mockCaptions[category] || mockData.mockCaptions.fashion;
    return {
      openai: captions.openai[Math.floor(Math.random() * captions.openai.length)],
      anthropic: captions.anthropic[Math.floor(Math.random() * captions.anthropic.length)],
      gemini: captions.gemini[Math.floor(Math.random() * captions.gemini.length)]
    };
  },

  generateHashtags: async (category, platform) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    const hashtags = mockData.mockHashtags[category] || mockData.mockHashtags.fashion;
    return hashtags.slice(0, 15);
  },

  generateCombinedContent: async (category, platform, userInput) => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
    const captions = await mockAPI.generateCaption(category, platform, userInput);
    const hashtags = await mockAPI.generateHashtags(category, platform);
    
    return {
      captions,
      hashtags,
      combinedResult: `${captions.openai}\n\n${hashtags.slice(0, 10).join(' ')}`
    };
  }
};