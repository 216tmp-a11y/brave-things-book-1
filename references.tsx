/**
 * References Page
 * 
 * Displays selected research behind the stories and activities for each chapter.
 * Provides academic backing and further reading for parents, caregivers, and educators.
 */

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ExternalLink, BookOpen, GraduationCap } from "lucide-react";

export default function References() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling to anchor when page loads or hash changes
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // If no hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-golden-50 to-forest-100 p-4">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/book/wtbtg')}
          className="text-forest-600 hover:text-forest-800 hover:bg-forest-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contents
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Card className="mb-8 bg-white/90 backdrop-blur-sm border-2 border-forest-200">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-forest-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-forest-800 mb-2">
                Selected Research Behind the Stories and Activities
              </CardTitle>
              <p className="text-forest-600 text-lg">
                Academic foundations supporting each chapter's social-emotional learning concepts
              </p>
            </CardHeader>
          </Card>

          {/* Chapter 1 - Mindfulness */}
          <Card id="chapter-1" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-golden-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-golden-100 rounded-full flex items-center justify-center text-golden-700 font-bold text-sm">1</span>
                Chapter 1 — Mindfulness (breathing, attention, self‑regulation)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• Harvard Center on the Developing Child (Executive Function overview)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Explains how "air-traffic control" skills (attention, inhibitory control, working memory) develop with practice and supportive environments, and why brief, consistent routines help.
                </p>
                <a 
                  href="https://developingchild.harvard.edu/resources/infographics/what-is-executive-function-and-how-does-it-relate-to-child-development/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Harvard Center Resource <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Child Mind Institute (The Power and Benefits of Mindfulness Meditation)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Plain-language summary on how mindful breathing helps kids reduce reactivity and refocus, with classroom applications.
                </p>
                <a 
                  href="https://childmind.org/article/the-power-of-mindfulness/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Child Mind Institute Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Stanford Medicine (Mindfulness training helps kids sleep better)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Research showing how mindfulness training improves sleep quality and emotional regulation in children.
                </p>
                <a 
                  href="https://med.stanford.edu/news/all-news/2021/07/mindfulness-training-helps-kids-sleep-better--stanford-medicine-.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Stanford Medicine Study <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Nature (Daily breath-based mindfulness exercises)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Peer-reviewed randomized controlled trial demonstrating the effectiveness of daily breathing exercises for children's well-being.
                </p>
                <a 
                  href="https://www.nature.com/articles/s41598-023-49354-0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Nature Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Mindfulness in schools meta-analysis (2023/2022)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Systematic reviews show school-based mindfulness has small-to-moderate benefits for attention, executive function, anxiety, and behavior when implemented well.
                </p>
                <div className="space-y-1">
                  <a 
                    href="https://www.sciencedirect.com/science/article/pii/S002244052200084X" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    ScienceDirect Study <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9524483/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    PMC Research Article <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 2 - Emotional Management */}
          <Card id="chapter-2" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">2</span>
                Chapter 2 — Emotional Management (noticing/labeling feelings)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• Lieberman et al. (2007)</p>
                <p className="text-forest-600 text-sm mb-2">
                  "Putting feelings into words" (affect labeling) reduces amygdala response and engages prefrontal control systems—mechanism behind "name it to tame it."
                </p>
                <div className="space-y-1">
                  <a 
                    href="https://pubmed.ncbi.nlm.nih.gov/17576282/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    PubMed Record <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://journals.sagepub.com/doi/10.1111/j.1467-9280.2007.01916.x" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    Publisher Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• National Library of Medicine (The Role of the Family Context in the Development of Emotion Regulation)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Research on how family environments support children's development of emotional regulation skills and the importance of naming feelings.
                </p>
                <a 
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2743505/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  PMC Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• American Academy of Pediatrics (Just Breathe—The Importance of Meditation Breaks for Kids)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Clinical guidance on how breathing exercises and mindfulness support emotional regulation in children.
                </p>
                <a 
                  href="https://www.healthychildren.org/English/healthy-living/emotional-wellness/Pages/Just-Breathe-The-Importance-of-Meditation-Breaks-for-Kids.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  AAP Guidance <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Child Mind Institute (Mindfulness in the classroom)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Summarizes evidence that attention-to-breath and noticing emotions support regulation and on-task behavior.
                </p>
                <a 
                  href="https://childmind.org/article/mindfulness-in-the-classroom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Classroom Mindfulness Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• CASEL (SEL framework)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Establishes emotion identification and regulation as core SEL competencies used in schools.
                </p>
                <a 
                  href="https://casel.org/state-resource-center/frameworks-competencies-standards-and-guidelines/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  CASEL Framework <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 3 - Bravery */}
          <Card id="chapter-3" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">3</span>
                Chapter 3 — Bravery (small steps, supportive exposure, coping self‑talk)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• National Library of Medicine (Children's Courage and Its Relationships to Anxiety Symptoms)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Research examining how courage development in children relates to anxiety management and emotional well-being.
                </p>
                <a 
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2817086/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  PMC Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• National Library of Medicine (The role of parental encouragement of bravery in child anxiety treatment)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Study on how parental support and encouragement of brave behaviors helps children overcome anxiety and build confidence.
                </p>
                <a 
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3766422/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  PMC Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• AACAP (Anxiety Resource Center)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Parent- and educator-facing guidance on evidence-based approaches (including gradual exposure) to help kids face fears with support.
                </p>
                <a 
                  href="https://www.aacap.org/aacap/Families_and_Youth/Resource_Centers/Anxiety_Disorder_Resource_Center/Home.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  AACAP Anxiety Resource Center <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Child Mind Institute (Mindfulness & anxiety)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Practical overview of how breathing and present-focus help children approach rather than avoid.
                </p>
                <a 
                  href="https://childmind.org/article/the-power-of-mindfulness/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Mindfulness & Anxiety Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Mindfulness in schools meta-analysis (Mettler et al., 2023)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Notes small-to-moderate effects on attention and impulsivity that can support "I can try" moments in classrooms.
                </p>
                <a 
                  href="https://www.sciencedirect.com/science/article/pii/S002244052200084X" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Meta-analysis Study <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 4 - Kindness */}
          <Card id="chapter-4" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-pink-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 font-bold text-sm">4</span>
                Chapter 4 — Kindness (prosocial behavior, ripple effects)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• National Library of Medicine (Parenting With a Kind Mind: Exploring Kindness as a Potentiator for Brain Health)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Research on how kindness practices support brain development and emotional well-being in children and families.
                </p>
                <a 
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8989141/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  PMC Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• SSM Health (The science behind kindness and how it's good for your health)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Evidence-based overview of how acts of kindness benefit both physical and mental health, including the ripple effect concept.
                </p>
                <a 
                  href="https://www.ssmhealth.com/newsroom/blogs/ssm-health-matters/november-2022/the-science-behind-kindness" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  SSM Health Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Greater Good Science Center (Kind kids → healthier communities)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Longitudinal evidence that early prosocial skills predict later academic and life outcomes, underscoring the importance of cultivating kindness.
                </p>
                <a 
                  href="https://greatergood.berkeley.edu/article/item/kind_kids_lead_to_healthier_communities" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Kind Kids Research <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Greater Good Science Center (Being kind makes kids happy)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Reports experimental findings (Aknin et al.) showing toddlers feel happier when they give, suggesting intrinsic rewards for kindness.
                </p>
                <a 
                  href="https://greatergood.berkeley.edu/article/item/being_kind_makes_kids_happy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Kindness & Happiness Study <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 5 - Gratitude */}
          <Card id="chapter-5" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-green-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">5</span>
                Chapter 5 — Gratitude (attention shift to positives, mood/sleep/connection)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• Harvard University (In Focus—Gratitude)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Comprehensive overview of gratitude research and its benefits for mental health, relationships, and overall well-being.
                </p>
                <a 
                  href="https://www.harvard.edu/in-focus/gratitude/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Harvard Gratitude Research <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Harvard Medical School (A simple 'thanks' may boost well-being)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Clinical evidence on how gratitude practices can improve mental health and emotional resilience in children and adults.
                </p>
                <a 
                  href="https://www.rcreader.com/news-releases/simple-thanks-may-boost-well-being-harvard-mental-health-letter" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Harvard Medical School Study <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Emmons (Gratitude and Well-Being)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Summaries of experimental work (Emmons & McCullough) showing regular gratitude practice improves mood, goal progress, social connection, and sleep; includes youth findings.
                </p>
                <a 
                  href="https://emmons.faculty.ucdavis.edu/gratitude-and-well-being/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Emmons Gratitude Research <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Greater Good Science Center (gratitude programs and practices)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Parent- and teacher-facing resources translating research to daily routines (journals, family rituals).
                </p>
                <a 
                  href="https://greatergood.berkeley.edu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Greater Good Science Center (search "gratitude") <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 6 - Sharing & Connection */}
          <Card id="chapter-6" className="mb-6 bg-white/90 backdrop-blur-sm border-l-4 border-l-cyan-400">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold text-sm">6</span>
                Chapter 6 — Sharing & Connection (needs-based problem solving, perspective‑taking)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• Frontiers in Human Neuroscience (Parents regulate arousal while sharing experiences with their child)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Research on how shared experiences and collaborative problem-solving between parents and children support emotional regulation and connection.
                </p>
                <a 
                  href="https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2023.1177687/full" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Frontiers Research Article <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="font-medium text-forest-700 mb-2">• Lives in the Balance (Ross Greene's Collaborative & Proactive Solutions)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Evidence-based framework for identifying both parties' concerns/needs and finding mutually satisfactory, durable solutions—practical grounding for "needs-based sharing."
                </p>
                <div className="space-y-1">
                  <a 
                    href="https://livesinthebalance.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    Lives in the Balance <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="http://livesinthebalance.org/wp-content/uploads/2023/12/CPS-Overview2023.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    CPS Overview PDF <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• CASEL (SEL relationships/problem-solving)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Locates perspective-taking, communication, and collaborative problem-solving within core SEL competencies widely adopted by districts and states.
                </p>
                <a 
                  href="https://casel.org/state-resource-center/frameworks-competencies-standards-and-guidelines/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  CASEL SEL Framework <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Cross-cutting References */}
          <Card className="mb-8 bg-white/90 backdrop-blur-sm border-2 border-forest-200">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800">
                Optional Cross-Cutting References
              </CardTitle>
              <p className="text-forest-600 text-sm">
                Use anywhere in your Parent/Caregiver Guides
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-forest-700 mb-2">• Child Mind Institute (mindfulness for kids and classrooms)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Accessible science-to-practice bridge for families and educators.
                </p>
                <div className="space-y-1">
                  <a 
                    href="https://childmind.org/article/the-power-of-mindfulness/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    Power of Mindfulness <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://childmind.org/article/mindfulness-in-the-classroom/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm block"
                  >
                    Mindfulness in the Classroom <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• Harvard Center on the Developing Child (executive function)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Why simple, repeated routines (like breathing, noticing, pausing) build the brain's control systems.
                </p>
                <a 
                  href="https://developingchild.harvard.edu/resources/infographics/what-is-executive-function-and-how-does-it-relate-to-child-development/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  Executive Function Resource <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <p className="font-medium text-forest-700 mb-2">• CASEL (SEL framework)</p>
                <p className="text-forest-600 text-sm mb-2">
                  Five core competencies and guidance for developmentally appropriate implementation.
                </p>
                <a 
                  href="https://casel.org/state-resource-center/frameworks-competencies-standards-and-guidelines/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-600 hover:text-forest-800 underline text-sm"
                >
                  CASEL Framework Guidelines <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/book/wtbtg')}
              className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Return to Table of Contents
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}