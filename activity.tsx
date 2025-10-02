/**
 * Universal Chapter Activities Page Template
 * 
 * Interactive activities page with universal template featuring:
 * - Warm cream background (#FDF6E3) 
 * - White rounded card containers with colored accent bars
 * - Science section with fun facts
 * - Activity section with practical tips
 * - Family discussion questions  
 * - Parent guide with do's and don'ts
 * - Printable resources
 * - Functional print button
 * - Vertical scrolling on one page
 */

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChapterActivityHeader } from "@/components/chapter-activity-header";
import { getChapterConfig } from "@/lib/chapter-config";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

// Chapter content interface
interface ChapterContent {
  theme: string;
  description: string;
  scienceFact: string;
  activityTitle: string;
  activityContent?: string;
  activitySteps?: string[];
  activityTip: string;
  discussionQuestions: string[];
  familyActivity: string;
  // New structure (Chapter 1)
  parentGuideTitle?: string;
  parentGuideContent?: string;
  parentTips?: string[];
  printableTitle?: string;
  printableDescription?: string;
  // Old structure (Chapters 2-6)
  parentDos?: string[];
  parentDonts?: string[];
  rememberNote?: string;
}

// Chapter-specific content data
const chapterContent: Record<number, ChapterContent> = {
  1: {
    theme: "Mindfulness & Deep Breathing",
    description: "Learn the power of mindful breathing and staying present in the moment with Mila and her friends.",
    scienceFact: "When you slow your breathing and listen carefully, two important brain areas team up. The prefrontal cortex (right behind your forehead) acts like a wise coach, telling the amygdala (the part that shouts 'Alert!') that everything is safe, so your heart can beat calmly and your ears can pick up tiny sounds. Doing mindful breaths often makes the coach stronger and the alarm quieter, which helps kids focus, worry less, and handle big feelings.",
    activityTitle: "Pond Breathing",
    activitySteps: [
      "Sit comfortably and close your eyes",
      "Take a slow, deep breath in through your nose (like smelling a beautiful flower)",
      "Hold it for a moment", 
      "Breathe out slowly through your mouth (like gently blowing on a pond to make ripples)",
      "Repeat 3-5 times",
      "Notice how your body feels more relaxed"
    ],
    activityTip: "Practice this together as a family before bedtime or when anyone feels overwhelmed!",
    discussionQuestions: [
      "When do you feel scattered or overwhelmed like Mila did?",
      "How did breathing help the friends feel better?",
      "What are some times when our family could use pond breathing together?",
      "What do you notice when you take slow, deep breaths?"
    ],
    familyActivity: "Create a 'calm-down corner' in your home with breathing reminder cards and a special cushion for practicing mindful moments together.",
    parentGuideTitle: "Why Mindfulness Comes First:",
    parentGuideContent: "Mindfulness is the foundation for all other emotional skills. When children learn to pause and notice what's happening in the moment, they're better able to recognize their feelings, make thoughtful choices, and stay calm during challenges. This chapter introduces the most basic but powerful tool: mindful breathing.",
    parentDos: [
      "Practice mindful breathing yourself when stressed",
      "Model staying present in the moment",
      "Acknowledge all feelings as normal and temporary",
      "Create quiet spaces for mindful moments"
    ],
    parentDonts: [
      "Rush to fix overwhelming feelings immediately",
      "Dismiss the need for calm-down time",
      "Skip breathing practice when you're stressed",
      "Force breathing exercises during meltdowns"
    ],
    rememberNote: "Mindfulness is a skill that grows with practice. When children see adults using breathing to stay calm, they naturally learn to do the same. Every mindful moment helps build emotional resilience.",
    printableTitle: "Pond Breathing Cards",
    printableDescription: "Printable reminder cards with simple breathing instructions and pond imagery. Place them in your child's room, the car, or anywhere they might need a calming reminder."
  },
  2: {
    theme: "Emotional Awareness & Naming Feelings",
    description: "Join Max and Camille the chameleon as they discover the importance of recognizing and naming emotions.",
    scienceFact: "When you name your feelings out loud, it actually calms your amygdala (alarm brain) and activates your prefrontal cortex (thinking brain) - like having a wise friend help you understand what's happening inside!",
    activityTitle: "Chameleon Feelings Chart",
    activityContent: "Draw a chameleon and color it with the colors that match your current feelings. Talk about why you chose those colors and practice saying 'I feel _____ and that's okay!'",
    activityTip: "Use feeling words throughout the day: 'I feel frustrated, so I'm going to take a breath' - this models emotional awareness for your child.",
    discussionQuestions: [
      "If you were a chameleon, what color would you be right now? Why?",
      "Can you remember a time today when you had a big feeling?",
      "Who can you talk to when you have a strong feeling?",
      "What helps you feel better when you're upset?"
    ],
    familyActivity: "Create a family feelings check-in routine using a chameleon chart. Each day, family members can color in how they're feeling and share one word about their emotions.",
    parentGuideTitle: "Why Emotional Management Comes Next:",
    parentGuideContent: "After children learn to notice what's happening in the moment, the next step is recognizing and naming their feelings. When kids can identify their emotions, they're better able to manage them and ask for what they need. This chapter helps children see that all feelings are okay and gives them simple tools to handle big emotions.",
    parentTips: [
      "Name your own feelings out loud (\"I feel frustrated, so I'm going to take a breath.\")",
      "Help your child use words for their feelings and remind them it's okay to feel all kinds of emotions.",
      "Use a feelings chart or chameleon coloring page to check in on emotions each day.",
      "Practice calming strategies together, like deep breathing or hugging a favorite toy."
    ],
    parentDos: [
      "Name your own feelings out loud",
      "Validate all emotions as normal",
      "Help your child find words for feelings",
      "Stay calm when big emotions arise"
    ],
    parentDonts: [
      "Dismiss or minimize feelings",
      "Say 'don't feel that way'",
      "Rush to fix emotions immediately",
      "Make feelings good or bad"
    ],
    rememberNote: "All feelings are valid information. When children can identify emotions, they're better able to manage them and ask for what they need.",
    printableTitle: "Chameleon Feelings Chart",
    printableDescription: "A simple chameleon outline kids can color in with different feelings. Hang it on the fridge or wall, and encourage your child to color it each day to show how they feel."
  },
  3: {
    theme: "Building Courage & Facing Fears",
    description: "Follow the friends as they cross the wobbly bridge and learn that bravery means trying even when you feel scared.",
    scienceFact: "When you try something brave, your brain creates new neural pathways that make you feel more confident next time. Each brave step literally grows your 'courage muscles' in your brain!",
    activityTitle: "Brave Steps Challenge",
    activityContent: "Create a 'bridge' at home (line on floor, pillow, or small step). Take turns crossing while saying 'I can try!' Practice celebrating every brave step, no matter how small.",
    activityTip: "Praise effort over outcome. Say 'I noticed you tried something new!' rather than focusing on success or failure.",
    discussionQuestions: [
      "What was your brave step today, even if it felt small?",
      "How did your body feel before and after trying something new?",
      "Who helped you be brave, or who could you help next time?",
      "What's something you'd like to try that feels a little scary?"
    ],
    familyActivity: "Start a family 'Bravery Board' where you add stars or notes every time someone faces a fear or tries something new. Celebrate courage together!",
    parentGuideTitle: "Why Building Courage Comes Third:",
    parentGuideContent: "Once children can stay present (mindfulness) and recognize their feelings (emotional awareness), they're better prepared to face new challenges. Bravery isn't about not feeling scared—it's about trying new things or facing fears, even when those feelings are there. This chapter helps children practice taking small, brave steps with support from friends.",
    parentTips: [
      "Share your own stories of times you felt scared but tried anyway.",
      "Break big challenges into smaller, manageable steps.",
      "Acknowledge that feeling scared is completely normal and okay.",
      "Celebrate every brave attempt, regardless of the outcome."
    ],
    parentDos: [
      "Share your own stories of bravery",
      "Break big challenges into small steps",
      "Acknowledge scared feelings as normal",
      "Create safe spaces for trying new things"
    ],
    parentDonts: [
      "Force children into scary situations",
      "Dismiss fears as silly",
      "Compare your child to others",
      "Focus only on successful outcomes"
    ],
    rememberNote: "Bravery isn't about not feeling scared - it's about trying new things even when those feelings are present. Every small brave step builds confidence.",
    printableTitle: "Brave Steps Badge",
    printableDescription: "A printable badge or sticker kids can decorate and wear after taking a brave step. Hang completed badges on a 'Bravery Board' to celebrate progress!"
  },
  4: {
    theme: "Kindness & Compassion",
    description: "Discover the ripple effect of kindness with the friends in the beautiful wildflower meadow.",
    scienceFact: "Doing something kind releases 'feel-good' chemicals like oxytocin in your brain, which help you feel happy and connected. Kindness is actually contagious - when one person is kind, others want to be kind too!",
    activityTitle: "Kindness Ripple Experiment",
    activityContent: "Fill a bowl with water and drop in a pebble while discussing how one kind act spreads like ripples. Then create a family kindness chain - add a paper link each time someone does something kind!",
    activityTip: "Notice and narrate kind acts: 'I saw you help your friend - that kindness made them smile!' This helps children recognize the impact of their actions.",
    discussionQuestions: [
      "Who did you help today, or who helped you?",
      "How did it feel to do something kind for someone else?",
      "What's one kind thing you'd like to try tomorrow?",
      "How do you think kindness spreads in our family?"
    ],
    familyActivity: "Start a 'Random Acts of Kindness' challenge where each family member does one secret kind thing for another family member each day for a week.",
    parentDos: [
      "Model kindness in daily interactions",
      "Point out when you see kind behavior",
      "Create opportunities for helping others",
      "Express gratitude for kind acts"
    ],
    parentDonts: [
      "Force sharing or kindness",
      "Use kindness as a bargaining tool",
      "Only praise big gestures",
      "Forget to be kind to yourself"
    ],
    rememberNote: "Kindness builds empathy and connection. Children learn kindness best through experiencing it themselves and seeing it modeled consistently.",
    printableTitle: "Kindness Chain Links",
    printableDescription: "Printable paper strips for making a kindness chain. Each strip has space to write or draw a kind act. Hang the chain in a visible spot and watch it grow!"
  },
  5: {
    theme: "Gratitude & Appreciation",
    description: "Join the friends in the magical Gratitude Garden as they learn to notice and appreciate the good things in life.",
    scienceFact: "Practicing gratitude changes your brain! It helps you notice more positive things, improves your mood, and can even help you sleep better and worry less.",
    activityTitle: "Family Gratitude Garden",
    activityContent: "Create paper leaves where family members write or draw things they're grateful for. Hang them on a branch or wall to grow your own gratitude garden at home.",
    activityTip: "Make gratitude specific and personal: 'I'm grateful for the way you helped me with dinner' rather than just 'thank you.' This helps children understand the impact of their actions.",
    discussionQuestions: [
      "What was your favorite thing that happened today?",
      "Who is someone you're grateful for and why?",
      "What's something small that made you smile today?",
      "How does it feel when someone says thank you to you?"
    ],
    familyActivity: "Start a bedtime gratitude ritual where each person shares three things they're grateful for - one about themselves, one about someone else, and one about their day.",
    parentDos: [
      "Model gratitude in daily life",
      "Focus on experiences over things",
      "Help children notice small positives",
      "Express specific appreciation"
    ],
    parentDonts: [
      "Force gratitude when child is upset",
      "Compare what others have/don't have",
      "Make gratitude a chore or requirement",
      "Dismiss negative feelings with 'be grateful'"
    ],
    rememberNote: "Gratitude is a skill that grows with practice. Children who regularly practice appreciation develop more positive outlooks and stronger resilience.",
    printableTitle: "Gratitude Leaves",
    printableDescription: "Printable paper leaves kids can color or write on. Hang them to grow a gratitude garden."
  },
  6: {
    theme: "Sharing & Cooperation",
    description: "Learn about creative problem-solving and meeting everyone's needs with the squirrel twins at the Sharing Tree.",
    scienceFact: "When we talk about our needs and solve problems together, it activates brain areas that help us think flexibly and feel connected. This releases oxytocin, making everyone feel good about fair solutions!",
    activityTitle: "Creative Sharing Challenge",
    activityContent: "Place one object (orange, toy, marker) between two people. Each says what they need it for, then brainstorm how both needs could be met. Celebrate win-win solutions!",
    activityTip: "Use 'needs language' at home: 'I need quiet to work; you need playtime - how can we meet both needs?' This teaches problem-solving over power struggles.",
    discussionQuestions: [
      "What did each twin need and how did listening help?",
      "Can you think of a time when we found a creative solution?",
      "How does talking about needs help us feel closer?",
      "What's the difference between wants and needs?"
    ],
    familyActivity: "Create 'Need-It/Share-It' cards for family problem-solving. When conflicts arise, use the cards to identify needs and brainstorm solutions together.",
    parentDos: [
      "Model talking about your own needs",
      "Praise creative problem-solving",
      "Listen to children's perspectives",
      "Focus on meeting needs, not equal distribution"
    ],
    parentDonts: [
      "Always solve conflicts for children",
      "Focus only on fairness over needs",
      "Rush to quick fixes",
      "Dismiss children's expressed needs"
    ],
    rememberNote: "Understanding needs versus wants helps children develop empathy and creative problem-solving skills. This foundation supports healthy relationships throughout life.",
    printableTitle: "Need-It / Share-It Cards & Dew-Cup Template",
    printableDescription: "Need-It / Share-It Cards – two-sided cards: 'I need...' on one side, 'You need...' on the other, to help kids voice needs during problem-solving. Dew-Cup Template – cut-and-fold paper cup (like Tessa's) with prompts: 'How will this cup help someone today?'"
  }
};

export default function Activity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isPreview } = useAuth();
  const chapterId = parseInt(id || "1");
  
  // Get chapter configuration and content
  const chapterConfig = getChapterConfig(chapterId);
  const content = chapterContent[chapterId as keyof typeof chapterContent];
  
  if (!chapterConfig || !content) {
    return <div>Chapter not found</div>;
  }

  // Handle scrolling - either to anchor or to top
  useEffect(() => {
    // Check if there's a hash in the URL (like #family-discussion)
    const hash = window.location.hash;
    
    if (hash) {
      // Wait a moment for the page to render, then scroll to the anchored element
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element && element instanceof HTMLElement) {
          // Calculate offset to account for sticky header
          const headerHeight = 80; // Approximate header height
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({ 
            top: elementPosition, 
            behavior: 'smooth' 
          });
        }
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      // No hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  const handleBackToChapter = () => {
    navigate(`/book/chapter/${chapterId}/story`);
  };

  const handleNextChapter = () => {
    // Check if user is preview and restrict access
    if (isPreview && chapterId >= 1) {
      // Preview users go back to Table of Contents instead of next chapter
      navigate("/book/wtbtg");
      return;
    }
    
    if (chapterId < 6) {
      // Navigate to next chapter story
      navigate(`/book/chapter/${chapterId + 1}/story`);
    } else {
      // Last chapter - go to conclusion
      navigate("/book/conclusion");
    }
  };

  const handlePrint = async () => {
    // 🎯 NEW: Enhanced print tracking
    try {
      const { trackPrintInteraction } = await import('@/lib/platform-tracking');
      const printData = trackPrintInteraction(`chapter_${chapterId}_activities`);
      
      console.log(`📊 Enhanced print tracking:`, {
        chapterId,
        printTarget: `chapter_${chapterId}_activities`,
        printClicks: printData.print_clicks,
        timeOnPage: printData.time_on_activity_page
      });
    } catch (error) {
      console.warn('Failed to track print interaction:', error);
    }
    
    // ⚠️ OLD: Keep existing print function
    chapterConfig.printFunction();
  };

  return (
    <div className="min-h-screen" style={{ background: '#FDF6E3' }}>
      
      {/* UNIVERSAL HEADER WITH NAVIGATION */}
      <ChapterActivityHeader
        chapterNumber={chapterConfig.number}
        chapterTitle={chapterConfig.title}
        badgeEmoji={chapterConfig.badgeEmoji}
        badgeText={chapterConfig.badgeText}
        onBackToContents={handleBackToContents}
        onBackToChapter={handleBackToChapter}
        onPrint={handlePrint}
      />

      {/* MAIN CONTENT - VERTICAL SCROLLING */}
      <div className="w-full max-w-none px-6 py-8">
        
        {/* UNIVERSAL TITLE SECTION */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#5D4E37' }}>
            Chapter {chapterConfig.number} Activities
          </h1>
          <h2 className="text-2xl mb-6" style={{ color: '#CD853F' }}>
            {content.theme}
          </h2>
          <p className="text-lg max-w-5xl mx-auto" style={{ color: '#5D4E37' }}>
            {content.description}
          </p>
        </motion.div>

        {/* UNIVERSAL ACTIVITIES GRID */}
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* 1. SCIENCE SECTION - LIGHT GREEN */}
          <motion.div
            id="science"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E6D2AA' }}>
              <CardHeader className="rounded-t-2xl border-l-4 border-l-green-400" style={{ background: '#F0FDF4' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ color: '#15803D' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#BBF7D0' }}>
                    🔬
                  </div>
                  Science Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4E37' }}>
                  The Science Behind {content.theme}
                </h3>
                <div className="space-y-4">
                  <p style={{ color: '#5D4E37' }}>
                    Understanding how our brains work helps us use these skills more effectively and feel confident in the process.
                  </p>
                  <div className="p-4 rounded-lg border" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                    <p className="text-sm" style={{ color: '#15803D' }}>
                      <strong>Fun Fact:</strong> {content.scienceFact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* 2. ACTIVITY SECTION - LIGHT BLUE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E6D2AA' }}>
              <CardHeader className="rounded-t-2xl border-l-4 border-l-blue-400" style={{ background: '#F0F9FF' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ color: '#1E40AF' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#BFDBFE' }}>
                    🎯
                  </div>
                  Try This Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4E37' }}>
                  {content.activityTitle}
                </h3>
                {content.activitySteps ? (
                  <ul className="space-y-2 mb-4" style={{ color: '#5D4E37' }}>
                    {content.activitySteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-4" style={{ color: '#5D4E37' }}>
                    {content.activityContent}
                  </p>
                )}
                <div className="p-4 rounded-lg border mt-6" style={{ background: '#F0F9FF', borderColor: '#BFDBFE' }}>
                  <p className="text-sm" style={{ color: '#1E40AF' }}>
                    <strong>💡 Tip:</strong> {content.activityTip}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. FAMILY DISCUSSION - LIGHT PURPLE */}
          <div id="family-discussion" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
            <Card className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E6D2AA' }}>
              <CardHeader className="rounded-t-2xl border-l-4 border-l-purple-400" style={{ background: '#FAF5FF' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ color: '#7C3AED' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#DDD6FE' }}>
                    💬
                  </div>
                  Family Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4E37' }}>
                  Questions to Explore Together
                </h3>
                <ul className="space-y-3 mb-6">
                  {content.discussionQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#DDD6FE', color: '#7C3AED' }}>
                        {index + 1}
                      </span>
                      <p style={{ color: '#5D4E37' }}>{question}</p>
                    </li>
                  ))}
                </ul>
                <div className="p-4 rounded-lg border" style={{ background: '#FAF5FF', borderColor: '#DDD6FE' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#7C3AED' }}>🎨 Family Activity:</h4>
                  <p className="text-sm" style={{ color: '#5D4E37' }}>
                    {content.familyActivity}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 4. PARENT GUIDE - LIGHT GREEN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E6D2AA' }}>
              <CardHeader className="rounded-t-2xl border-l-4 border-l-green-400" style={{ background: '#F0FDF4' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ color: '#15803D' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#BBF7D0' }}>
                    👨‍👩‍👧‍👦
                  </div>
                  Adult Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4E37' }}>
                  Supporting Your Child's {content.theme} Skills
                </h3>
                
                {/* Parent Guide Content */}
                {content.parentGuideTitle && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>{content.parentGuideTitle}</h4>
                    <p className="mb-4" style={{ color: '#5D4E37' }}>
                      {content.parentGuideContent}
                    </p>
                  </div>
                )}
                
                {/* Activities / Tips section (Chapter 1 only) */}
                {chapterId === 1 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities / Tips:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice pond breathing together before meals or bedtime
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Use breathing when someone feels frustrated or overwhelmed
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Create a calm-down corner with breathing reminders
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Model mindful breathing yourself when you feel stressed
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Notice and praise when your child uses breathing to self-regulate
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Activities / Tips section (Chapter 2 only) */}
                {chapterId === 2 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities & Tips:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Name your own feelings out loud ("I feel frustrated, so I'm going to take a breath.")
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Help your child use words for their feelings and remind them it's okay to feel all kinds of emotions.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Use a feelings chart or chameleon coloring page to check in on emotions each day.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice calming strategies together, like deep breathing or hugging a favorite toy.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Activities section (Chapter 3 only) */}
                {chapterId === 3 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities to Practice:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Create a "brave steps" chart where you and your child add a star every time someone tries something that feels a little scary.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice saying "I can try!" together before attempting new things, even small ones like trying a new food.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Make a "bridge" at home (tape line on floor, cushions, or step) and take turns crossing while encouraging each other.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Share one story each day about a time you felt nervous but tried something anyway—take turns with your child.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Activities section (Chapter 4 only) */}
                {chapterId === 4 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities to Practice:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Start a family "kindness chain" using paper strips—add a link each time someone does something kind for another person.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Play "kindness detective" where you and your child notice and report kind acts you see others doing.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice giving specific compliments to each other: "I noticed you shared your toy—that made your sister smile."
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Choose one small act of kindness to do together each day, like helping a neighbor or leaving a nice note for someone.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Activities section (Chapter 5 only) */}
                {chapterId === 5 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities to Practice:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Create a family gratitude jar where everyone adds one written thing they're grateful for each day.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice "gratitude spotting" during daily activities: "I'm grateful for this warm soup" or "I'm grateful for your laugh."
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Make paper leaves to hang around your home with things your family is thankful for.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Start a bedtime "3 gratitudes" routine where each person shares three specific things they appreciated that day.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Activities section (Chapter 6 only) */}
                {chapterId === 6 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activities to Practice:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice the "one orange challenge"—put one object between two people and have them each explain what they need it for, then brainstorm solutions together.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Create "Need-It cards" where family members write what they need during conflicts, then work together to find win-win solutions.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Practice saying "I need..." and "You need..." statements during everyday situations like choosing what to watch or eat.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Celebrate creative solutions by adding them to a family "Sharing Success" chart when everyone's needs are met.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Do's and Don'ts structure for all chapters */}
                {content.parentDos && content.parentDonts && (
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>✅ Do This:</h4>
                      <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                        {content.parentDos.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: '#DC2626' }}>⚠️ Avoid This:</h4>
                      <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                        {content.parentDonts.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Legacy parentTips structure for chapters that don't have Do's/Don'ts yet */}
                {content.parentTips && !content.parentDos && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#15803D' }}>Activity & Tips:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: '#5D4E37' }}>
                      {content.parentTips.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {content.rememberNote && (
                  <div className="p-4 rounded-lg border mt-6" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                    <h4 className="font-semibold mb-2" style={{ color: '#15803D' }}>🌟 Remember:</h4>
                    <p className="text-sm" style={{ color: '#5D4E37' }}>
                      {content.rememberNote}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. PRINTABLES - LIGHT YELLOW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E6D2AA' }}>
              <CardHeader className="rounded-t-2xl border-l-4 border-l-yellow-400" style={{ background: '#FFFBEB' }}>
                <CardTitle className="flex items-center gap-3 text-xl" style={{ color: '#D97706' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                    📄
                  </div>
                  Printable Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4E37' }}>
                  {content.printableTitle || "Take These Activities Offline"}
                </h3>
                <p className="mb-6" style={{ color: '#5D4E37' }}>
                  {content.printableDescription || "Print chapter-specific resources including activity cards, worksheets, and family discussion guides that you can use away from screens."}
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={async () => {
                      // 🎯 NEW: Enhanced print tracking for main button
                      try {
                        const { trackPageInteraction, trackPrintInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                        
                        // Track the print button interaction
                        trackPageInteraction('print', 'print_all_resources_button', {
                          print_target: `chapter_${chapterId}_all_resources`
                        });
                        
                        // Track print-specific data
                        const printData = trackPrintInteraction(`chapter_${chapterId}_all_resources`);
                        
                        // Send enhanced analytics immediately
                        await sendEnhancedAnalytics(chapterId, 1, [], printData);
                        
                        console.log(`📊 Enhanced print tracking (main button):`, {
                          chapterId,
                          buttonType: 'print_all_resources_button',
                          printTarget: `chapter_${chapterId}_all_resources`,
                          printClicks: printData.print_clicks,
                          timeOnPage: printData.time_on_activity_page
                        });
                      } catch (error) {
                        console.warn('Failed to track print interaction:', error);
                      }
                      
                      // Call the original print function
                      handlePrint();
                    }}
                    className="flex items-center gap-2 text-white px-6 py-3"
                    style={{ background: '#D97706' }}
                  >
                    <Download className="w-4 h-4" />
                    Print All Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* UNIVERSAL BOTTOM NAVIGATION */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t" style={{ borderColor: '#E6D2AA' }}>
          <Button
            onClick={handleBackToChapter}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: '#E6D2AA', color: '#5D4E37', background: 'white' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chapter {chapterConfig.number}
          </Button>
          
          <div className="text-center">
            <p className="text-sm" style={{ color: '#5D4E37' }}>
              Great job exploring these {content.theme.toLowerCase()} activities!
            </p>
          </div>
          
          <Button
            onClick={handleNextChapter}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: '#E6D2AA', color: '#5D4E37', background: 'white' }}
          >
            {/* Preview users see "Table of Contents" text, full users see normal navigation */}
            {isPreview && chapterId >= 1 ? (
              <>
                Table of Contents
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                {chapterId < 6 ? `Next Chapter ${chapterId + 1}` : "Conclusion"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}