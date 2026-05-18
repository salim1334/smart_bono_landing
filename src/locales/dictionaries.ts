export type Language = 'en' | 'am';

export const dictionaries = {
  en: {
    nav: {
      smartPrinting: "Smart Printing",
      hybrid: "Hybrid",
      pricing: "Pricing",
      trust: "Trust",
      getStarted: "Get started",
    },
    hero: {
      badge: "Built by Alarm Technology",
      title1: "Run your cafe.",
      title2: "No internet.",
      title3: "No limits.",
      subtitle: "Smart bono is a professional, Amharic-native cafeteria system. Take orders, manage sales and print receipts entirely offline — straight from your phone.",
      btnPricing: "See pricing",
      btnHow: "How it works",
      stats: { offline: "Offline ready", languages: "Languages", tiers: "Pricing tiers" },
      floating: {
        offlineTitle: "Offline · still selling",
        offlineSub: "Connection",
        receiptTitle: "Printed in 1.2s",
        receiptSub: "Receipt #000125",
      }
    },
    valuePills: {
      pill1: { t: "Reliability", s: "Works fully offline — power cuts and dropped connections never stop a sale." },
      pill2: { t: "Modernity", s: "Print thermal receipts straight from your phone. No PC, no cables." },
      pill3: { t: "Control", s: "Optional hybrid sync gives owners live analytics from anywhere." },
    },
    smartPrinting: {
      badge: "Smart Printing",
      title: "One phone is all your floor needs.",
      sub: "Forget bulky desktops and tangled cables. Smart bono pairs wirelessly with any thermal printer, so your cashier carries the entire counter in their pocket.",
      features: [
        { t: "Bluetooth thermal printing", s: "Pair once, print forever — receipts in Amharic & English." },
        { t: "No PC, no clutter", s: "A modern, sleek counter that fits any cafe aesthetic." },
        { t: "Professional receipts", s: "Custom header, logo, taxes and totals — every time." },
      ]
    },
    hybrid: {
      badge: "The Hybrid Ecosystem",
      title1: "Waiter, Kitchen, Cashier —",
      title2: "in sync.",
      sub: "When you're ready to scale, Smart bono Hybrid connects every role in your cafe. Orders flow instantly across devices and into the cloud — so owners can manage the floor from anywhere.",
      steps: [
        { t: "Waiter takes the order", s: "Tap items on a phone, send straight to the kitchen.", lbl: "STEP 01" },
        { t: "Kitchen sees it instantly", s: "Live ticket display, no scribbled paper, no missed items.", lbl: "STEP 02" },
        { t: "Cashier closes the bill", s: "Payment, printing and reporting in two taps.", lbl: "STEP 03" },
        { t: "Owner watches live", s: "Real-time sales and analytics from anywhere in the world.", lbl: "STEP 04" },
      ]
    },
    dailyOps: {
      badge: "Floor Operations",
      title1: "Tap, order, and",
      title2: "print instantly.",
      sub: "Easily browse products, take orders, and print receipts in seconds. Keep track of all-day sales, monitor delivered items directly from the counter, and view performance for every individual waiter on your shift.",
      minis: [
        { lbl: "Quick Ordering", sub: "Visual product menu" },
        { lbl: "Instant Print", sub: "Zero-delay receipts" },
        { lbl: "Daily Sales", sub: "Track shifts easily" },
        { lbl: "Waiter Stats", sub: "Individual performance" },
      ]
    },
    admin: {
      badge: "Back-Office Management",
      title1: "Administer sales from",
      title2: "anywhere.",
      sub: "As an admin, you have a bird's-eye view of your entire business. Monitor live sales, track detailed orders, and review staff performance without stepping foot in the cafe.",
      features: [
        { t: "Live Sales Dashboards", s: "Get real-time insights into your top-selling items and overall revenue." },
        { t: "Staff & Waiter Tracking", s: "See exactly who is processing orders and analyze their productivity." },
        { t: "Complete Order History", s: "Deep dive into past transactions, refunds, and daily summaries." },
      ]
    },
    pricing: {
      badge: "Pricing",
      title: "Pick a plan. Save on longer terms.",
      sub: "Transparent pricing in Ethiopian Birr. Commit longer, save more.",
      months: ["3 months", "6 months", "12 months"],
      save: ["", "Save 10%", "Save 20%"],
      popular: "Most popular",
      custom: "Custom",
      talkSales: "Talk to sales",
      monthlbl: "ብር / mo",
      billed: "ብር billed every",
      contact: "Contact sales",
      choose: "Choose",
      tiersLabel: { Entry: "Entry", Professional: "Professional", Full: "Full", Hybrid: "Hybrid" },
      tiersAm: { Entry: "መነሻ", Professional: "ፕሮፌሽናል", Full: "ሙሉ", Hybrid: "ሃይብሪድ" },
      tiersTag: { 
        Entry: "Essential offline printing", 
        Professional: "Adds cashflow management", 
        Full: "Ingredients & inventory", 
        Hybrid: "Enterprise multi-device sync" 
      },
      tiersFeat: {
        Entry: ["Offline-first POS", "Mobile thermal printing", "Menu & order taking", "Daily sales summary", "Amharic + English UI"],
        Professional: ["Everything in Entry", "Cashflow & expense tracking", "Cashier shift reports", "Grouped order reports", "Multi-payment methods", "Receipt customisation"],
        Full: ["Everything in Professional", "Ingredient & recipe tracking", "Low-stock alerts", "Supplier management", "Advanced analytics & charts"],
        Hybrid: ["Everything in Full", "Waiter · Kitchen · Cashier sync", "Cloud dashboard for owners", "Real-time remote analytics", "Multi-branch ready", "Priority onboarding"]
      }
    },
    trust: {
      items: [
        { t: "Data backup", s: "Your sales data is safely backed up — on device and (optionally) in the cloud." },
        { t: "Connectivity-proof", s: "Designed for Ethiopia: power cuts and dropped lines never lose a transaction." },
        { t: "Bilingual support", s: "Onboarding, training and support in Amharic and English." },
      ]
    },
    cta: {
      title: "Ready to bring Smart bono to your cafe?",
      sub: "Talk to the Alarm Technology team. We'll set you up with the right tier, train your staff and get your first receipt printing today.",
      pricing: "See pricing",
      sales: "Contact sales",
    },
    footer: {
      by: "by Alarm Technology",
      city: "Addis Ababa, Ethiopia."
    }
  },
  am: {
    nav: {
      smartPrinting: "ስማርት ህትመት",
      hybrid: "የተዋሃደ አሰራር",
      pricing: "ዋጋ",
      trust: "አስተማማኝነት",
      getStarted: "አሁን ይጀምሩ",
    },
    hero: {
      badge: "በአላርም ቴክኖሎጂ የተሰራ",
      title1: "ካፌዎን በቀላሉ ያስተዳድሩ።",
      title2: "ያለ ኢንተርኔት።",
      title3: "ያለምንም ውጣውረድ።",
      subtitle: "ስማርት ቦኖ አማርኛን እና እንግሊዝኛን የሚረዳ የካፌ ስርዓት ነው። ትዕዛዞችን ይቀበሉ፣ ሽያጭዎን ያስተዳድሩ እና ደረሰኞችን በቀጥታ ከስልክዎ ያትሙ - ሙሉ በሙሉ ያለ ኢንተርኔት።",
      btnPricing: "ዋጋዎቹን ይመልከቱ",
      btnHow: "እንዴት እንደሚሰራ",
      stats: { offline: "ያለ ኢንተርኔት ይሰራል", languages: "ቋንቋዎች", tiers: "የአከፋፈል አማራጮች" },
      floating: {
        offlineTitle: "ከኢንተርኔት ውጭም ሽያጭ አይቋረጥም",
        offlineSub: "ኢንተርኔት (Connection)",
        receiptTitle: "በ1.2 ሰከንድ የታተመ",
        receiptSub: "ደረሰኝ #000125",
      }
    },
    valuePills: {
      pill1: { t: "አስተማማኝነት", s: "ሙሉ በሙሉ ከመስመር ውጭ(Offline) ይሰራል - የመብራት መቆራረጥም ሆነ የኔትዎርክ መጥፋት ሽያጭዎን አያስተጓጉልም።" },
      pill2: { t: "ዘመናዊነት", s: "የሙቀት ደረሰኞችን (Thermal receipts) በቀጥታ ከስልክዎ ያትሙ። ኮምፒውተርም ሆነ ገመድ አያስፈልግም።" },
      pill3: { t: "ሙሉ ቁጥጥር", s: "ከየትኛውም ቦታ ሆነው የቀጥታ ሽያጭ መረጃዎችን እና ትንተናዎችን መከታተል ያስችላል።" },
    },
    smartPrinting: {
      badge: "ዘመናዊ ህትመት",
      title: "አንድ ስልክ ለሙሉ ካፌዎ በቂ ነው።",
      sub: "ሰፊ ቦታ የሚይዙ ኮምፒውተሮችን እና የተጠላለፉ ገመዶችን አያስፈልጉም። ስማርት ቦኖ ከየትኛውም የብሉቱዝ አታሚ (Thermal printer) ጋር ያለገመድ ይገናኛል። ካሸርዎ ጠቅላላ ትዕዛዞችን ከስልኳ ሆና ታስተዳድራለች።",
      features: [
        { t: "የብሉቱዝ (Bluetooth) ህትመት", s: "አንዴ ብቻ ያገናኙ (Pair)፣ በማንኛውም ጊዜ በአማርኛ ደረሰኞችን ያትሙ።" },
        { t: "ኮምፒውተር የለም፣ ገመድ የለም", s: "ለማንኛውም ካፌ የሚስማማ ዘመናዊ እና ቀላል አሰራር።" },
        { t: "ፕሮፌሽናል ደረሰኞች", s: "ትዕዛዝ መለያ ቁጥር፣ የትዕዛዙ ዝርዝር፣ የውጭ መስተንግዶ መለያ አድራሻ እና ጠቅላላ ድምር ያለው ደረሰኝ በእያንዳንዱ ህትመት።" },
      ]
    },
    hybrid: {
      badge: "የተዋሃደ ስርዓት (Hybrid)",
      title1: "አስተናጋጅ፣ ማእድ ቤት፣ ካሸር",
      title2: "ሁሉም የተናበበ አሰራር።",
      sub: "ስራዎን ለማስፋፋት ሲያስቡ፣ ስማርት ቦኖ በእያንዳንዱ የካፌዎ የስራ ሂደት ያሉትን ሰራተኞች ያገናኛል። ትዕዛዞች በቅጽበት ከስልክ ወደ ስልክ እንዲሁም ወደ ዳታ ማዕከል ይተላለፋሉ ስለዚህ ባለቤቶች ካፌውን ከየትኛውም ቦታ ሆነው ማስተዳደር ይችላሉ።",
      steps: [
        { t: "አስተናጋጅ ትዕዛዝ ይቀበላል", s: "በስልክ ላይ ምግቦቹን በመምረጥ ቀጥታ ወደ ማእድ ቤት ይልካል።", lbl: "ደረጃ 01" },
        { t: "ማእድ ቤት ወዲያውኑ ያየዋል", s: "የቀጥታ ትዕዛዝ ማሳያ፣ በወረቀት ላይ መጻፍ የለም፣ የተረሳ ትዕዛዝ የለም።", lbl: "ደረጃ 02" },
        { t: "ካሸር ሂሳቡን ይዘጋል", s: "በሁለት ነካ (Tap) ብቻ ክፍያ፣ ህትመት እና ሪፖርት ይከናወናል።", lbl: "ደረጃ 03" },
        { t: "ባለቤት በየትም ቦታ ሆኖ ይመለከታል", s: "የቀጥታ ሽያጭ እና ትንታኔዎች ከየትኛውም የዓለም ክፍል በእጅዎ።", lbl: "ደረጃ 04" },
      ]
    },
    dailyOps: {
      badge: "የዕለት ተዕለት ክንውኖች",
      title1: "ይዘዙ፣ ያረጋግጡ፣",
      title2: "እና ወዲያውኑ ያትሙ።",
      sub: "ምርቶችን በቀላሉ ይምረጡ፣ ትዕዛዞችን ይቀበሉ እና ደረሰኞችን በሰከንዶች ውስጥ ያትሙ። የሙሉ ቀን ሽያጭን ይከታተሉ፣ የትኞቹ ምርቶች እንደተሸጡ ከካሸር ሆነው ይቆጣጠሩ፣ እንዲሁም በእያንዳንዱ ፈረቃ የእያንዳንዱን አስተናጋጅ አፈፃፀም ይመልከቱ።",
      minis: [
        { lbl: "ፈጣን ትዕዛዝ", sub: "ምርቶችን በምስል ማየት" },
        { lbl: "ፈጣን ህትመት", sub: "ያለ ምንም መዘግየት ጠቅ ያድርጉ፣ ያትሙ" },
        { lbl: "የዕለቱ ሽያጭ", sub: "ፈረቃዎችን በቀላሉ ይከታተሉ" },
        { lbl: "የአስተናጋጆች መረጃ", sub: "የእያንዳንዱ ሰው አፈጻጸም" },
      ]
    },
    admin: {
      badge: "የአስተዳደር እና የባለቤት መቆጣጠሪያ",
      title1: "ሽያጭዎን በሚመችዎ",
      title2: "ቦታ ሆነው ያስተዳድሩ።",
      sub: "እንደ ባለቤት ወይም አስተዳዳሪ፣ የጠቅላላ ስራዎን ዝርዝር መረጃ ከላይ ሆነው መመልከት ይችላሉ። የቀጥታ ሽያጭን ይከታተሉ፣ ዝርዝር ትዕዛዞችን ያረጋግጡ፣ እና የሰራተኞችዎን አፈፃፀም ካፌው ሳይደርሱ ይቆጣጠሩ።",
      features: [
        { t: "የቀጥታ የሽያጭ ዳሽቦርድ ማሳያ", s: "በጣም የተሸጡትን ምርቶችዎን እና ጠቅላላ ገቢዎን በፍጥነት ይመልከቱ።" },
        { t: "የሰራተኞች እና አስተናጋጆች ትንታኔ", s: "እያንዳንዱን ትዕዛዝ ማን እንዳስተናገደ ይመልከቱ እና ምርታማነታቸውን ይለኩ።" },
        { t: "የተሟላ የትዕዛዝ ታሪክ", s: "ያለፉትን ግብይቶች፣ የተመለሱ ሂሳቦች እና የዕለታዊ ማጠቃለያ ሪፖርቶችን መለስ ብለው ይመርምሩ።" },
      ]
    },
    pricing: {
      badge: "የዋጋ አማራጮች",
      title: "ለእርስዎ የሚስማማውን ይምረጡ። ለረጅም ጊዜ ሲከፍሉ ተጨማሪ ቅናሽ ያገኛሉ።",
      sub: "ግልጽ የሆነ ዋጋ በኢትዮጵያ ብር። ለረዥም ጊዜ ሲከፍሉ፣ የበለጠ ይቆጥባሉ።",
      months: ["በየ3 ወሩ", "በየ6 ወሩ", "በየ12 ወሩ"],
      save: ["", "10% ቅናሽ", "20% ቅናሽ"],
      popular: "ብዙዎች የመረጡት",
      custom: "ልዩ የዋጋ ስምምነት",
      talkSales: "ለሽያጭ ክፍል ያነጋግሩ",
      monthlbl: "ብር / በወር",
      billed: "ብር፣ የሚከፈለው በየ",
      contact: "የሽያጭ ክፍል",
      choose: "ይምረጡ",
      tiersLabel: { Entry: "መነሻ", Professional: "ፕሮፌሽናል", Full: "ሙሉ", Hybrid: "ሃይብሪድ" },
      tiersAm: { Entry: "መነሻ", Professional: "ፕሮፌሽናል", Full: "ሙሉ", Hybrid: "ሃይብሪድ" },
      tiersTag: { 
        Entry: "መሰረታዊ የካፌ ስራ እና ያለ ማቋረጥ ማተም", 
        Professional: "እለታዊ የገንዘብ እንቅስቃሴ እና ወጪ ቁጥጥር ተጨማሪ", 
        Full: "ጥሬ እቃ እና የእቃ ግምጃ ቤት ቁጥጥር ተጨማሪ", 
        Hybrid: "በተለያዩ ስልኮች ለመጠቀም እና በቀጥታ ለማገናኘት" 
      },
      tiersFeat: {
        Entry: ["ያለ ኢንተርኔት የሚሰራ POS", "በስልክዎ የሙቀት ደረሰኞችን (Thermal) ማተም", "ሜኑ እና ትዕዛዝ መቀበል", "ዕለታዊ የሽያጭ ማጠቃለያ", "የአማርኛ + የእንግሊዝኛ ቋንቋ"],
        Professional: ["በመነሻ አማራጭ ያሉትን ሁሉ", "የገቢና ወጪ ቁጥጥር", "የካሸር ፈረቃ (Shift) ሪፖርቶች", "የተሰባሰቡ የትዕዛዝ ሪፖርቶች", "የተለያዩ የክፍያ አማራጮች", "የደረሰኝ ዝግጅት ማስተካከያ (Customisation)"],
        Full: ["በፕሮፌሽናል አማራጭ ያሉትን ሁሉ", "የካፌ ጥሬ እቃ እና የምግብ አሰራር (Recipe) ክትትል", "አላቂ እቃዎች ሲኖሩ ማስጠንቀቂያ", "አቅራቢዎች ማስተዳደሪያ", "የተራቀቁ የአሰራር ትንታኔዎች እና ግራፎች"],
        Hybrid: ["በሙሉ አማራጭ ያሉትን ሁሉ", "አስተናጋጅ · ማእድ ቤት · ካሸርን የሚያነብብ", "ለባለቤቶች የደመና (Cloud) ማሳያ", "ከየትኛውም ቦታ የሚታይ የቀጥታ ሰንጠረዥ", "ለብዙ ቅርንጫፎች የተመቻቸ", "የቅድሚያ የደንበኛ እንክብካቤ"]
      }
    },
    trust: {
      items: [
        { t: "የመረጃ ደህንነት (Data Backup)", s: "የሽያጭ ውሂብዎ በስልክዎ ላይ፣ እንዲሁም በተፈለገ ጊዜ በደመና (Cloud) ላይ በተጠበቀ ሁኔታ ይቀመጣል።" },
        { t: "ይሰራል! ግንኙነት ቢቋረጥም", s: "ለኢትዮጵያ ታስቦ የተሰራ፡ የመብራት መቆራረጥ እና የኮኔክሽን ችግር ግብይትዎን አያቋርጡም።" },
        { t: "ባለ 2 ቋንቋ ድጋፍ", s: "ሲጀምሩም ሆነ ሲሰሩ የስልጠና እና የቴክኒክ ድጋፍ በአማርኛ እና በእንግሊዝኛ እንሰጣለን።" },
      ]
    },
    cta: {
      title: "ስማርት ቦኖን ወደ ካፌዎ ለማምጣት ዝግጁ ነዎት?",
      sub: "የአላርም ቴክኖሎጂ ቡድንን ያነጋግሩ። ተገቢ የሆነውን የአከፋፈል አማራጭ እንመርጥልዎታለን፤ ለሰራተኞችዎ ስልጠና ሰጥተን ዛሬውኑ የመጀመሪያ ደረሰኝዎን እንዲያትሙ እናደርጋለን።",
      pricing: "ዋጋዎቹን ይመልከቱ",
      sales: "የሽያጭ ክፍል ያነጋግሩ",
    },
    footer: {
      by: "በአላርም ቴክኖሎጂ (Alarm Technology)",
      city: "አዲስ አበባ፣ ኢትዮጵያ።"
    }
  }
};
