const base = import.meta.env.BASE_URL;

export const articlesSeed = [
  {
    id: 'article-planting-basics',
    title: '第一次養植物：先成功一盆就好',
    description: '新手最常見的失敗不是技術，而是一次帶太多盆回家。',
    content:
      '如果你剛開始接觸植物，先挑一盆容易照顧的品項會比一次買三盆更穩定。\n\n先觀察家裡光線與通風，再決定擺放位置。固定一個澆水日，比每天擔心它會不會渴更有幫助。\n\n當你有了第一盆的成功經驗，再慢慢加第二盆，養植栽就會變成一種舒服的日常。',
    author: 'Verde Days',
    create_at: 1739232000,
    image: `${base}images/about/brand-story.jpeg`,
    tag: ['新手入門', '室內植栽'],
    isPublic: true,
  },
  {
    id: 'article-light-and-placement',
    title: '光線不夠怎麼辦？室內擺位三步驟',
    description: '看懂窗向與日照時間，找到植物與空間都舒服的位置。',
    content:
      '很多植物問題不是澆水錯，而是光照不對。\n\n第一步先看窗向：東向柔和、南向充足、西向偏強、北向較弱。第二步用一週時間觀察日照移動，記下最穩定的亮區。第三步把植物放在「能看見它、也有光」的位置。\n\n擺對位置後，照護難度會直接下降。',
    author: 'Verde Days',
    create_at: 1739404800,
    image: `${base}images/about/about-hero.jpeg`,
    tag: ['光照', '居家佈置'],
    isPublic: true,
  },
  {
    id: 'article-watering-rhythm',
    title: '澆水節奏：用土壤狀態決定，而不是固定天數',
    description: '從「表土乾了沒」開始，建立你自己的澆水判斷。',
    content:
      '每個家的溫度、濕度、通風都不同，照著別人的天數澆水常常會失準。\n\n更好的方式是觀察：把手指伸進表土約 2 到 3 公分，乾了再澆透。澆水時讓水流到底盤，再把多餘積水倒掉。\n\n你會發現植物需要的是穩定節奏，而不是頻繁打擾。',
    author: 'Verde Days',
    create_at: 1739664000,
    image: `${base}images/about/packing-and-care.jpeg`,
    tag: ['澆水', '養護技巧'],
    isPublic: true,
  },
  {
    id: 'article-repotting-timing',
    title: '什麼時候要換盆？三個明確訊號',
    description: '根系、土壤、澆水速度，幫你判斷是否該升級盆器。',
    content:
      '換盆不是越常越好，而是出現需要時再處理。\n\n第一個訊號是根系從盆底孔冒出，第二個是土壤板結、澆水一下就穿過，第三個是生長季明顯停滯。\n\n操作時只升一個尺寸，保留部分舊土，讓植物更快適應新環境。',
    author: 'Verde Days',
    create_at: 1739836800,
    image: `${base}images/about/curated-selection.jpeg`,
    tag: ['換盆', '進階照護'],
    isPublic: true,
  },
  {
    id: 'article-styling-corners',
    title: '把植物融入空間：玄關、桌面、窗邊的搭配法',
    description: '用高度差與材質對比，讓綠意看起來自然不刻意。',
    content:
      '植栽在空間裡的角色，不只是裝飾，也能引導視線與節奏。\n\n玄關適合一盆直立線條的中型植物，桌面適合小盆點綴，窗邊可以用高低盆器做層次。\n\n關鍵是留白。讓植物有呼吸空間，比塞滿每個角落更耐看。',
    author: 'Verde Days',
    create_at: 1740009600,
    image: `${base}images/about/closing-cta-mood.jpeg`,
    tag: ['空間風格', '生活提案'],
    isPublic: true,
  },
  {
    id: 'article-gift-ideas',
    title: '送禮植物怎麼選？避免踩雷的四個重點',
    description: '從照護門檻、收禮者生活型態到包裝細節一次整理。',
    content:
      '送植物最好先想收禮者的生活節奏。\n\n如果對方平常很忙，優先選擇低照護品種；如果是搬家或新空間，可挑耐看的中型觀葉。搭配簡潔包裝與照護卡，會比昂貴盆器更實用。\n\n一盆好照顧、看得久的植物，比短暫的驚喜更有記憶點。',
    author: 'Verde Days',
    create_at: 1740182400,
    image: `${base}images/about/closing-cta-mood2.jpeg`,
    tag: ['送禮', '選品指南'],
    isPublic: true,
  },
];
