import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  MapPin, 
  User, 
  Sparkles, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  Lightbulb, 
  Layers, 
  Award,
  ChevronRight,
  X
} from 'lucide-react';

interface CryptoTokenInfo {
  symbol: string;
  name: string;
  founderName: string;
  birthDate: string;
  birthPlace: string;
  launchYear: string;
  whoCreated: string;
  birthAndBackground: string;
  ideaEmerge: string;
  timeline: string[];
  innovations: string[];
  popularity: string;
  founderPhoto: string;
  originalLogo: string;
}

const CRYPTO_TOKENS: CryptoTokenInfo[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    founderName: 'Satoshi Nakamoto',
    birthDate: 'Unknown',
    birthPlace: 'Unknown',
    launchYear: '2008 - 2009',
    whoCreated: 'Satoshi Nakamoto is the pseudonym used by the anonymous individual or team of developers who created the world’s first successful decentralized cryptocurrency. To this day, no one knows with absolute certainty whether Satoshi Nakamoto is a single person or a collaborative team of elite developers.',
    birthAndBackground: 'Because Satoshi Nakamoto’s true identity remains completely unknown, there is no verified public information about their birth date, nationality, physical residence, or background story.',
    ideaEmerge: 'The idea for Bitcoin emerged during the severe global financial crisis of 2008. At that time, many people lost trust in traditional banking systems, centralized financial institutions, and government-managed fiat networks. Bitcoin was designed as an independent peer-to-peer electronic money system that would allow individuals to send and receive capital directly without relying on banks, governments, or other physical intermediaries.',
    timeline: [
      'October 31, 2008: The Bitcoin Whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System" was published to a cryptography mailing list.',
      'January 3, 2009: The first Bitcoin block, known as the Genesis Block, was successfully mined, officially launching the live Bitcoin network.'
    ],
    innovations: [
      'The first successful realworld implementation of a secure distributed blockchain ledger.',
      'A fully decentralized, permissionless, and open-source financial network.',
      'Peer-to-peer transactions without the need for central clearing houses, banks, or payment processors.',
      'A transparent, secure public ledger maintained cryptographically by distributed network miners.'
    ],
    popularity: 'In 2010, the first real-world Bitcoin transaction occurred when 10,000 BTC were used to purchase two pizzas. By 2013, Bitcoin began attracting serious global media and investment attention. It reached mainstream popularity during the 2017 cryptocurrency bull market and surpassed $60,000 for the first time in 2021, cementing its position as the ultimate world leading cryptocurrency and digital gold asset.',
    founderPhoto: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=600&auto=format&fit=crop', // Crypto conceptual block picture
    originalLogo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    founderName: 'Vitalik Buterin',
    birthDate: 'January 31, 1994',
    birthPlace: 'Kolomna, Russia',
    launchYear: '2013 - 2015',
    whoCreated: 'The primary founder and designer of Ethereum is Vitalik Buterin, a brilliant Russian-Canadian programmer, computer engineer, and blockchain author.',
    birthAndBackground: 'Born in Kolomna, Russia, Vitalik later immigrated to Canada with his parents, where he developed a high-scale interest in programming, math, and blockchain technology, co-founding Bitcoin Magazine in 2011 to share crypto knowledge.',
    ideaEmerge: 'Vitalik Buterin recognized that Bitcoin was excellent for decentralized value transfers but was highly limited when it came to running complex logic and customized programs. He envisioned a blockchain with an integrated Turing-complete programming language, creating a platform where any developer could construct arbitrary centralized-free software applications.',
    timeline: [
      '2013: Vitalik published the Ethereum Concept and whitepaper.',
      '2014: Conducted highly successful crowdfunding token campaign.',
      'July 30, 2015: The Ethereum Mainnet was officially launched, distributing the genesis block.'
    ],
    innovations: [
      'Globally executable Smart Contracts running on decentralized state machines.',
      'Decentralized Application (DApp) architectures.',
      'Underlying standards for Non-Fungible Tokens (NFTs) and customized ERC-20 utility tokens.',
      'Formed the technological bed of Decentralized Finance (DeFi).'
    ],
    popularity: 'Ethereum experienced explosive global growth during the 2017 ICO Boom, when thousands of blockchain startups and decentralized projects utilized Ethereum’s token structure to raise capital, cementing it as the undisputed master of smart contracts.',
    founderPhoto: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Vitalik_Buterin_TechCrunch_Disrupt_London_2015_%28cropped%29.jpg',
    originalLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    founderName: 'Brock Pierce, Reeve Collins, & Craig Sellars',
    birthDate: 'Brock Pierce (May 14, 1980)',
    birthPlace: 'Minnesota, USA',
    launchYear: '2014',
    whoCreated: 'Tether was founded by Brock Pierce, Reeve Collins, and Craig Sellars. It operates as the worlds premier and largest reserve-backed fiat stablecoin.',
    birthAndBackground: 'Brock Pierce is a prominent early bitcoin advocate, venture capitalist, and former child actor. Reeve Collins is a veteran technology entrepreneur, and Craig Sellars has worked as a leading open-source blockchain engineer within the Omni Layer.',
    ideaEmerge: 'Cryptocurrency prices are famous for extreme volatility. Traders and market participants faced major asset risks when holding highly fluctuating coins. Tether was created to offer a highly stable digital asset whose value would remain closely tied 1:1 with the U.S. Dollar, providing a safe fiat alternative.',
    timeline: [
      'July 2014: Conceived and initially launched under the market name "Realcoin".',
      'November 2014: Rebranded as Tether (USDT), establishing reserve-backing concepts.'
    ],
    innovations: [
      'Designed and executed the worlds first successful fiat-pegged stablecoin system.',
      'Provided deep liquidity flows and fast settlement times between virtual currency exchanges.',
      'Enabled traders to easily hold digital dollars without relying directly on central commercial bank wire systems.'
    ],
    popularity: 'USDT became universally adopted across global exchanges between 2017 and 2018. It is now one of the most heavily and consistently traded cryptocurrencies on earth, capturing multi-trillion dollar transaction flows annually.',
    founderPhoto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brock_Pierce_by_Gage_Skidmore_2.jpg/440px-Brock_Pierce_by_Gage_Skidmore_2.jpg',
    originalLogo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'U.S. Dollar Coin',
    founderName: 'Centre Consortium (Circle & Coinbase)',
    birthDate: 'Consortium established in 2018',
    birthPlace: 'United States',
    launchYear: '2018',
    whoCreated: 'USDC was launched via a strategic partnership called Centre Consortium, spearheaded by Circle Internet Financial (led by CEO Jeremy Allaire) and Coinbase exchange.',
    birthAndBackground: 'Jeremy Allaire (Circle CEO, born May 13, 1968 in USA) is an experienced software technology leader. USDC was built with strict support from major US banking circles to guarantee financial transparency.',
    ideaEmerge: 'USDC was created to solve stability challenges in the crypto business by offering a highly transparent, fully regulated, and institutional-grade stablecoin that undergoes consistent, professional financial security audits.',
    timeline: [
      'September 2018: USD Coin (USDC) was officially released by Circle & Coinbase.',
      '2020-2021: Achieved historical liquidity scaling during the DeFi ecosystem expansion.'
    ],
    innovations: [
      'Uncompromising regular reserve audits completed by leading independent financial institutions.',
      'Strongly regulated money transmitter compliance structure within the United States.',
      'Seamless multi-blockchain routing integrations.'
    ],
    popularity: 'USDC grew with unmatched speed from 2020 to 2021, particularly chosen due to its compliance-first reputation. It remains a premier reliable currency used inside decentralized finance applications of Web3.',
    founderPhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop', // Business finance illustration
    originalLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    founderName: 'Changpeng Zhao (CZ)',
    birthDate: 'September 10, 1977',
    birthPlace: 'Jiangsu, China',
    launchYear: '2017',
    whoCreated: 'Binance Coin (BNB) was created by Changpeng Zhao (popularly known as CZ), an elite software computer scientist and global financial platform developer.',
    birthAndBackground: 'Born in Jiangsu, China, CZ immigrated with his family to Vancouver, Canada, where he developed deep expertise in computer systems and trade engine architectures, working at Bloomberg and the Tokyo Stock Exchange.',
    ideaEmerge: 'In 2017, CZ founded Binance, which became the largest cryptocurrency exchange within 6 months. BNB was originally built on Ethereum to give platform traders discounts on orderbook fees.',
    timeline: [
      'July 2017: Launched Binance exchange via an ICO, issuing BNB.',
      '2020: Deployed the high-performance BNB Smart Chain, moving BNB into its native currency.'
    ],
    innovations: [
      'The worlds most successful utility token fee discount ecosystem.',
      'Systematic programmatic token burns to shrink total asset supply.',
      'Native fuel of the BNB Chain, facilitating ultra-low fees and high-speed blocks.'
    ],
    popularity: 'BNB experienced extreme, skyward growth in 2021. This rise was fueled directly by the rapid adoption of BNB Smart Chain, where Ethereum users migrated to save on massive transaction fee costs, establishing BNB as a top 3 global cryptocurrency.',
    founderPhoto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Changpeng_Zhao_cropped.jpg/440px-Changpeng_Zhao_cropped.jpg',
    originalLogo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    founderName: 'Chris Larsen & Jed McCaleb',
    birthDate: 'Larsen (b. 1960), McCaleb (b. 1975)',
    birthPlace: 'Larsen (California, USA), McCaleb (Arkansas, USA)',
    launchYear: '2012',
    whoCreated: 'XRP was co-founded by Silicon Valley entrepreneur Chris Larsen and famous software developer Jed McCaleb (known for eDonkey, Mt.Gox, and Stellar).',
    birthAndBackground: 'Chris Larsen is an experienced financial entrepreneur. Jed McCaleb is an open-source advocate who engineered key peer-to-peer applications before building the XRP Ledger consensus code.',
    ideaEmerge: 'Existing international bank transfers (SWIFT wire systems) took days and incurred heavy commission fees. XRP was designed as an independent global settlement currency, providing banks with immediate cross-border payment settlement.',
    timeline: [
      '2012: Established OpenCoin (which rebranded to Ripple Labs).',
      '2017: XRP was adopted worldwide, partnering with systemic cross-border banking corridors.'
    ],
    innovations: [
      'Consensus ledger algorithm that processes settlements in 3-5 seconds.',
      'Extremely negligible fee overhead (fractions of a single penny).',
      'Completely mined-free structure, offering green carbon-neutral consensus.'
    ],
    popularity: 'During the historic 2017 digital asset bull run, XRP became one of the largest and most well-known cryptocurrencies on Earth, representing central bank payment innovation.',
    founderPhoto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Chris_Larsen%2C_Ripple_labs_co_founder_cropped.png/440px-Chris_Larsen%2C_Ripple_labs_co_founder_cropped.png',
    originalLogo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
  },
  {
    symbol: 'POL',
    name: 'Polygon',
    founderName: 'Jaynti Kanani, Sandeep Nailwal, & Anurag Arjun',
    birthDate: 'Co-founders born in the late 1980s',
    birthPlace: 'Mumbai, Maharashtra, India',
    launchYear: '2017 - 2019',
    whoCreated: 'Polygon (originally established as Matic Network) was co-founded by Indian blockchain software engineers Jaynti Kanani, Sandeep Nailwal, and Anurag Arjun.',
    birthAndBackground: 'The co-founders are leading Indian technology figures. Jaynti Kanani was key to implementing Ethereum’s Plasma scalability research, uniting with Sandeep Nailwal and Anurag Arjun in Mumbai.',
    ideaEmerge: 'As Ethereum transaction volume grew, users faced severe bottlenecks, low speeds, and unaffordable gas costs. The founders created Polygon to act as a robust multichain scaling solution for Ethereum, solving gas price issues.',
    timeline: [
      '2017: Project development officially began under "Matic Network".',
      '2019: MATIC token was officially launched.',
      '2021: Rebranded to Polygon, expanding Ethereum scalability suite.',
      '2024: Upgraded native asset symbol to POL representing Polygon 2.0.'
    ],
    innovations: [
      'Deploying high-scalability Plasma framework integrations.',
      'Proof of Stake sidechain capabilities matching the security of Ethereum.',
      'Universal framework for building interconnected blockchain scaling solutions.'
    ],
    popularity: 'Polygon saw explosive widespread usage in 2021 and 2022. Millions of dApp users and key platforms migrated to Polygon to enjoy fraction-of-a-cent fees and immediate block confirmation times.',
    founderPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop', // Technical coder photo
    originalLogo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  {
    symbol: 'VERSE',
    name: 'Verse',
    founderName: 'Bitcoin.com (Roger Ver)',
    birthDate: 'January 27, 1979',
    birthPlace: 'San Jose, California, USA',
    launchYear: '2022',
    whoCreated: 'VERSE is the native utility, loyalty, and community rewards token of the world-renowned Bitcoin.com Ecosystem, developed under early bitcoin investor Roger Ver.',
    birthAndBackground: 'Roger Ver was one of Bitcoins promptest angel investors and developers (earning the title "Bitcoin Jesus" for funding early crypto start-ups, blockchain.com, and advocate systems).',
    ideaEmerge: 'Designed to encourage decentralized user adoption. Roger Ver and Bitcoin.com created VERSE to reward users for trading crypto, learning basic blockchain concepts, and actively engaging with ecosystem DeFi services.',
    timeline: [
      'Late 2022: VERSE token officially launched on Ethereum network.',
      '2023-Present: Powers decentralized yield farming, staking rewards, and Verse DEX liquidity.'
    ],
    innovations: [
      'Ecosystem integration with Web3 gamified learning models.',
      'Integrated user loyalty programs for mobile wallet applications.',
      'Direct decentralized liquidity provider incentives.'
    ],
    popularity: 'VERSE gained immediate support among Bitcoin.com’s global user base of over 40 million wallet users, driving quick DeFi adoption and onboarding beginners into crypto history.',
    founderPhoto: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Roger_Ver_October_2013.jpg',
    originalLogo: 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg'
  },
  {
    symbol: '9_TABLE',
    name: 'Summary Table',
    founderName: 'Multi-foundational systems',
    birthDate: 'Various periods',
    birthPlace: 'Worldwide network',
    launchYear: '2009 - Present',
    whoCreated: 'This matrix provides a structured, responsive lookup comparing creators, release dates, and critical popularity peaks across history.',
    birthAndBackground: 'Curated compilation of top projects inside the decentralized timeline.',
    ideaEmerge: 'Designed to offer researchers and users a quick, comprehensive reference point.',
    timeline: [
      '2009: Bitcoin official launch begins comparison epoch.',
      '2015: Ethereum introduces smart contract comparative fields.',
      '2017: Market-wide convergence of values and popularity trends.'
    ],
    innovations: [
      'Responsive, colored crypto comparison matrices.',
      'Chronological mapping across all major chains.',
      'Clean market indicators.'
    ],
    popularity: 'A beautifully formatted breakdown tracking market-wide growth epochs.',
    founderPhoto: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    originalLogo: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png'
  },
  {
    symbol: '10_PEOPLE',
    name: 'Top Influencers',
    founderName: 'Satoshi, Vitalik, CZ',
    birthDate: 'Multiple Key Dates',
    birthPlace: 'Worldwide Blockchain Sphere',
    launchYear: '2008 - Present',
    whoCreated: 'Satoshi Nakamoto created Bitcoin. Vitalik Buterin created Ethereum. Changpeng Zhao scaled world-class trading at Binance.',
    birthAndBackground: 'Biography summary profiles of the critical figures who drove the major innovations of decentralization.',
    ideaEmerge: 'The pioneers recognized that blockchain technology needs both underlying security, programmable capabilities, and massive global accessibility to change humanity.',
    timeline: [
      '2008: Satoshi Nakamoto publishes Whitepaper.',
      '2013: Vitalik Buterin authors Ethereum Whitepaper.',
      '2017: CZ founds Binance, reaching #1 volume in months.'
    ],
    innovations: [
      'Pioneered peer-to-peer cryptocurrency systems.',
      'Pioneered smart contract decentralized computation.',
      'Pioneered global liquidity and ecosystem scalability networks.'
    ],
    popularity: 'The primary figures who built the bed of the modern multichain landscape.',
    founderPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    originalLogo: 'https://cdn-icons-png.flaticon.com/512/476/476863.png'
  }
];

interface VerbatimSection {
  heading: string;
  body: string | string[];
}

interface VerbatimDoc {
  symbol: string;
  title: string;
  sections: VerbatimSection[];
}

const VERBATIM_DOCS: Record<string, VerbatimDoc> = {
  BTC: {
    symbol: 'BTC',
    title: '1. Bitcoin (BTC)',
    sections: [
      {
        heading: 'Who Created Bitcoin?',
        body: "Bitcoin was created by Satoshi Nakamoto, a pseudonym used by the individual or group responsible for developing the world's first successful decentralized cryptocurrency. To this day, no one knows with certainty whether Satoshi Nakamoto is a single person or a team of developers."
      },
      {
        heading: 'Birth and Background',
        body: "Because Satoshi Nakamoto's true identity remains unknown, there is no verified information about their birth date, nationality, or place of birth."
      },
      {
        heading: 'How Did the Idea of Bitcoin Emerge?',
        body: "The idea for Bitcoin emerged during the global financial crisis of 2008. At that time, many people lost trust in traditional banking systems and centralized financial institutions. Bitcoin was designed as a digital currency that would allow people to send and receive money directly without relying on banks, governments, or other intermediaries."
      },
      {
        heading: 'When Was Bitcoin Created?',
        body: [
          "October 31, 2008: The Bitcoin Whitepaper titled \"Bitcoin: A Peer-to-Peer Electronic Cash System\" was published.",
          "January 3, 2009: The first Bitcoin block, known as the Genesis Block, was mined, officially launching the Bitcoin network."
        ]
      },
      {
        heading: 'What Innovations Did Bitcoin Introduce?',
        body: [
          "The first successful use of blockchain technology.",
          "A fully decentralized financial network.",
          "Peer-to-peer transactions without the need for banks or payment processors.",
          "A transparent and secure public ledger maintained by network participants."
        ]
      },
      {
        heading: 'When Did Bitcoin Become Popular?',
        body: [
          "2010: The first real-world Bitcoin transaction occurred when 10,000 BTC were used to purchase two pizzas.",
          "2013: Bitcoin began attracting global media attention.",
          "2017: Bitcoin reached mainstream popularity during the cryptocurrency bull market.",
          "2021: Bitcoin surpassed $60,000 for the first time, cementing its position as the world's leading cryptocurrency."
        ]
      }
    ]
  },
  ETH: {
    symbol: 'ETH',
    title: '2. Ethereum (ETH)',
    sections: [
      {
        heading: 'Founder',
        body: "The primary founder of Ethereum is Vitalik Buterin."
      },
      {
        heading: 'Birth Information',
        body: [
          "Date of Birth: January 31, 1994",
          "Place of Birth: Kolomna, Russia",
          "Later, Vitalik moved to Canada with his family, where he continued developing his interest in programming and blockchain technology."
        ]
      },
      {
        heading: 'Why Was Ethereum Created?',
        body: "Vitalik Buterin recognized that Bitcoin was excellent for transferring value but limited when it came to running complex applications. He envisioned a blockchain platform that could execute programmable code, enabling developers to build decentralized applications directly on the blockchain."
      },
      {
        heading: 'Development Timeline',
        body: [
          "2013: Ethereum concept and whitepaper introduced.",
          "2014: Ethereum conducted a crowdfunding campaign.",
          "July 30, 2015: Ethereum Mainnet officially launched."
        ]
      },
      {
        heading: 'Ethereum\'s Greatest Contributions',
        body: [
          "Smart Contracts",
          "Decentralized Applications (DApps)",
          "Non-Fungible Tokens (NFTs)",
          "Decentralized Finance (DeFi)",
          "These innovations transformed Ethereum into the foundation of a large portion of the modern blockchain ecosystem."
        ]
      },
      {
        heading: 'Popularity',
        body: "Ethereum experienced explosive growth during the 2017 ICO Boom, when thousands of blockchain projects used Ethereum to launch their tokens."
      }
    ]
  },
  USDT: {
    symbol: 'USDT',
    title: '3. Tether (USDT)',
    sections: [
      {
        heading: 'Founders',
        body: [
          "Brock Pierce",
          "Reeve Collins",
          "Craig Sellars"
        ]
      },
      {
        heading: 'Launch Year',
        body: "Tether was launched in 2014."
      },
      {
        heading: 'Why Was Tether Created?',
        body: "Cryptocurrency prices are known for extreme volatility. Tether was created to provide a stable digital asset whose value would remain closely tied to the U.S. Dollar, offering traders a way to reduce exposure to market fluctuations."
      },
      {
        heading: 'How Does Tether Work?',
        body: "Tether is designed to maintain a value of approximately 1 USDT = 1 USD. The company states that its tokens are backed by reserves consisting of cash and other financial assets."
      },
      {
        heading: 'Importance',
        body: [
          "Price stability",
          "Easier movement of funds between exchanges",
          "A digital alternative to holding cash"
        ]
      },
      {
        heading: 'Popularity',
        body: "USDT became widely adopted between 2017 and 2018 and is now one of the most heavily traded cryptocurrencies in the world."
      }
    ]
  },
  USDC: {
    symbol: 'USDC',
    title: '4. USD Coin (USDC)',
    sections: [
      {
        heading: 'Founders',
        body: "USDC was launched through a partnership between Circle and Coinbase."
      },
      {
        heading: 'Launch Year',
        body: "2018"
      },
      {
        heading: 'Why Was USDC Created?',
        body: "USDC was created to provide a highly transparent, regulated, and trustworthy stablecoin backed by the U.S. Dollar."
      },
      {
        heading: 'Key Features',
        body: [
          "Regular reserve audits",
          "Dollar-backed structure",
          "Managed by reputable financial technology companies",
          "Strong regulatory compliance"
        ]
      },
      {
        heading: 'Popularity',
        body: "USDC grew rapidly during 2020–2021, particularly due to the expansion of the DeFi ecosystem."
      }
    ]
  },
  BNB: {
    symbol: 'BNB',
    title: '5. Binance Coin (BNB)',
    sections: [
      {
        heading: 'Founder',
        body: "Changpeng Zhao (CZ)"
      },
      {
        heading: 'Birth Information',
        body: [
          "Date of Birth: September 10, 1977",
          "Place of Birth: Jiangsu, China",
          "Later, his family immigrated to Canada, where he developed his expertise in computer science and finance."
        ]
      },
      {
        heading: 'The Beginning of Binance',
        body: "In 2017, CZ founded Binance, which quickly became one of the largest cryptocurrency exchanges in the world."
      },
      {
        heading: 'Why Was BNB Created?',
        body: "Initially, BNB was launched to provide discounts on trading fees for Binance users."
      },
      {
        heading: 'Evolution of BNB',
        body: [
          "Over time, BNB expanded beyond fee discounts and became the native token of BNB Chain (formerly Binance Smart Chain). It is now used for:",
          "Transaction fees",
          "Staking",
          "DeFi applications",
          "Blockchain governance"
        ]
      },
      {
        heading: 'Popularity',
        body: "BNB experienced significant growth in 2021, fueled by the rapid adoption of BNB Chain and decentralized applications."
      }
    ]
  },
  XRP: {
    symbol: 'XRP',
    title: '6. Ripple (XRP)',
    sections: [
      {
        heading: 'Founders',
        body: [
          "Chris Larsen (Born: 1960, Birthplace: California, USA)",
          "Jed McCaleb (Born: 1975, Birthplace: Arkansas, USA)"
        ]
      },
      {
        heading: 'Why Was XRP Created?',
        body: "XRP was developed to improve international payments by making cross-border transactions faster, cheaper, and more efficient than traditional banking systems."
      },
      {
        heading: 'Key Features',
        body: [
          "Extremely fast transaction settlement",
          "Low transaction costs",
          "Does not rely on mining like Bitcoin",
          "Designed for financial institutions and payment providers"
        ]
      },
      {
        heading: 'Popularity',
        body: "During the 2017 cryptocurrency bull market, XRP became one of the largest and most recognized cryptocurrencies globally."
      }
    ]
  },
  POL: {
    symbol: 'POL',
    title: '7. Polygon (POL / Formerly MATIC)',
    sections: [
      {
        heading: 'Founders',
        body: [
          "Jaynti Kanani",
          "Sandeep Nailwal",
          "Anurag Arjun",
          "All three founders are from India."
        ]
      },
      {
        heading: 'Why Was Polygon Created?',
        body: "As Ethereum grew, users faced two major problems: high transaction fees and network congestion/slow transaction speeds. Polygon was developed to solve these scalability issues."
      },
      {
        heading: 'Development Timeline',
        body: [
          "2017: Project development began.",
          "2019: MATIC token officially launched."
        ]
      },
      {
        heading: 'What Does Polygon Do?',
        body: [
          "Polygon functions as a scaling solution for Ethereum, helping users enjoy:",
          "Lower transaction costs",
          "Faster transaction speeds",
          "Improved user experience",
          "It has become one of the most important infrastructure projects in the blockchain industry."
        ]
      },
      {
        heading: 'Popularity',
        body: "Polygon saw rapid adoption and growth throughout 2021."
      }
    ]
  },
  VERSE: {
    symbol: 'VERSE',
    title: '8. Verse (VERSE)',
    sections: [
      {
        heading: 'What Is Verse?',
        body: "VERSE is the native utility and rewards token of the Bitcoin.com Ecosystem."
      },
      {
        heading: 'Founder',
        body: "Bitcoin.com"
      },
      {
        heading: 'Key Figure',
        body: [
          "Roger Ver",
          "Date of Birth: January 27, 1979",
          "Place of Birth: California, USA",
          "Roger Ver is one of the earliest Bitcoin investors and a prominent advocate for cryptocurrency adoption worldwide."
        ]
      },
      {
        heading: 'Why Was Verse Created?',
        body: "VERSE was designed to encourage user participation across Bitcoin.com's products and services while rewarding engagement within the ecosystem."
      },
      {
        heading: 'Main Use Cases',
        body: [
          "Rewards and incentives",
          "Staking",
          "Community participation programs",
          "DeFi applications",
          "Ecosystem growth initiatives"
        ]
      },
      {
        heading: 'Launch Year',
        body: "2022"
      },
      {
        heading: 'Popularity',
        body: "VERSE began gaining recognition among Bitcoin.com users and community members during late 2022 and continued expanding as the ecosystem developed."
      }
    ]
  },
  '9_TABLE': {
    symbol: '9_TABLE',
    title: '9. Summary Table / সারাংশ তথ্য সারণী',
    sections: [
      {
        heading: 'Project Core Founders & Epochs Comparison',
        body: "This matrix aggregates the seminal founders, genesis dates, and high impact mass-adoption recognition periods for the eight trailblazing networks defining blockchain's first double-decade history."
      },
      {
        heading: 'Why This Summary Table Matters',
        body: "To understand the broader crypto ecosystem, comparing milestones side-by-side demonstrates the acceleration rate of the industry. From 2009's digital cash breakthrough to 2022's gamified loyalty rewards, each network filled a specific historical niche."
      }
    ]
  },
  '10_PEOPLE': {
    symbol: '10_PEOPLE',
    title: '10. Three Influential Figures / ক্রিপ্টো ইতিহাসের ৩ জন প্রভাবশালী ব্যক্তি',
    sections: [
      {
        heading: 'Satoshi Nakamoto - The Anonymous Visionary',
        body: "The peer-to-peer electronic cash system started on October 31, 2008. By launching Bitcoin, Satoshi solved the double-spend problem without intermediate servers, delivering decentralized consensus rules that power thousands of assets today."
      },
      {
        heading: 'Vitalik Buterin - The Logic Generalizer',
        body: "Vitalik envisioned the blockchain not merely as a ledger for transactions, but as a turing-complete computational layer. Emerging in 2015, Ethereum enabled developers to build self-executing conditions, kicking off the Web3 ecosystem."
      },
      {
        heading: 'Changpeng Zhao - The Scale Aggregator',
        body: "CZ realized that for blockchain to win globally, mass-scale fluid liquid trading portals were necessary. Under CZ's speed-centric execution, Binance was launched in 2017 to handle massive concurrent matching engines, establishing crypto exchange standards globally."
      }
    ]
  }
};

export default function CryptoHistory({ onBack }: { onBack: () => void }) {
  const [selectedToken, setSelectedToken] = useState<CryptoTokenInfo | null>(CRYPTO_TOKENS[0]);
  const [activeTab, setActiveTab] = useState<'creator' | 'idea' | 'tech' | 'popularity'>('creator');
  const [showDetailedModal, setShowDetailedModal] = useState<boolean>(false);
  const detailsRef = React.useRef<HTMLDivElement>(null);

  // Set active tab to 'creator' when selected token changes, plus scroll to details on mobile
  useEffect(() => {
    setActiveTab('creator');
    if (window.innerWidth < 1024 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedToken]);

  return (
    <div className="bg-[#03081e] min-h-screen text-slate-100 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-blue-900/30 overflow-visible relative shadow-2xl">
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-blue-900/30 pb-6 mb-8 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-550/20 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          Back to Portal
        </button>
        <div className="text-center sm:text-right">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sky-300 tracking-wider">
            Crypto Founder and History
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#bd9471] font-bold uppercase mt-1">
            Historical Discovery & Blockchain Chronology
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* SIDE BAR / SEQUENCE SELECTOR */}
        <div className="lg:col-span-4 space-y-3 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[11px] font-mono font-black uppercase text-slate-400 tracking-widest px-1.5 flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Blockchain Token Archives
          </p>

          <div className="space-y-3">
            {CRYPTO_TOKENS.map((token, index) => {
              const isSelected = selectedToken?.symbol === token.symbol;
              return (
                <motion.button
                  key={token.symbol}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedToken(token)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f1d3a] border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-blue-950/20 border-blue-900/40 hover:bg-[#071330] hover:border-blue-900/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 p-1 border border-blue-900/25 flex items-center justify-center flex-shrink-0">
                      <img
                        src={token.originalLogo}
                        alt={token.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        {token.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{token.symbol} Protocol</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-extrabold bg-[#050b1a] border border-blue-950 px-2 py-0.5 rounded text-[#bd9471]">
                      #{index + 1}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* DETAILS DISPLAY CARD */}
        <div ref={detailsRef} className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedToken ? (
              <motion.div
                key={selectedToken.symbol}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#07112b] border border-blue-900/40 rounded-[2.5rem] p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-visible"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

                {/* Token Header Card */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-blue-900/20 pb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-amber-500/30 p-2 flex items-center justify-center shadow-lg transform rotate-2 flex-shrink-0">
                    <img
                      src={selectedToken.originalLogo}
                      alt={selectedToken.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <span className="text-[9px] font-mono tracking-widest font-black uppercase bg-amber-500/10 border border-amber-500/15 text-amber-500 px-2.5 py-1 rounded-full">
                      HISTORICAL SPEC SHEET
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1.5">{selectedToken.name} ({selectedToken.symbol})</h3>
                    <p className="text-xs text-[#bd9471] font-mono uppercase font-black">Genesis Launch: {selectedToken.launchYear}</p>
                  </div>
                </div>

                {/* TABBED NAVIGATION FOR COMPREHENSIVE INFORMATION */}
                {selectedToken.symbol !== '9_TABLE' && selectedToken.symbol !== '10_PEOPLE' && (
                  <div className="flex flex-wrap gap-2 border-b border-blue-900/25 pb-3">
                    <button
                      onClick={() => setActiveTab('creator')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'creator'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-slate-300'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Founder Bio</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('idea')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'idea'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-slate-300'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Idea Emerge</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('tech')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'tech'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-slate-300'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Innovations</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('popularity')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'popularity'
                          ? 'bg-[#B8A5E6]/15 text-[#bd9471] border border-[#bd9471]/30'
                          : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-slate-300'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Popularity</span>
                    </button>
                  </div>
                )}

                {/* ACTIVE TAB CONTENT OR CUSTOM COMPONENT CORES */}
                <div className="space-y-5 min-h-[300px]">
                  {selectedToken.symbol !== '9_TABLE' && selectedToken.symbol !== '10_PEOPLE' ? (
                    <AnimatePresence mode="wait">
                      {activeTab === 'creator' && (
                        <motion.div
                          key="creator-tab"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="space-y-5"
                        >
                          {/* Founder Visual Frame */}
                          <div className="flex flex-col sm:flex-row gap-5 bg-slate-950/50 p-4 border border-blue-900/30 rounded-2xl items-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-blue-900/40 bg-blue-950/40 flex-shrink-0 shadow-lg relative">
                              <img 
                                src={selectedToken.founderPhoto} 
                                alt={selectedToken.founderName} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                            </div>
                            <div className="space-y-2 flex-1 text-center sm:text-left">
                              <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                Core Architect
                              </span>
                              <h4 className="text-lg font-black text-white">{selectedToken.founderName}</h4>
                              
                              <div className="grid grid-cols-2 gap-3 text-left pt-1">
                                <div>
                                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Date of Birth</span>
                                  <span className="text-xs font-bold text-slate-200">{selectedToken.birthDate}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Place of Birth</span>
                                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                                    {selectedToken.birthPlace}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Story Paragraphs */}
                          <div className="space-y-4">
                            <div className="bg-[#04091a]/40 p-4 border border-blue-950 rounded-2xl space-y-1.5">
                              <h5 className="text-xs font-mono font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                Who Created {selectedToken.name}?
                              </h5>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                                {selectedToken.whoCreated}
                              </p>
                            </div>

                            <div className="bg-[#04091a]/40 p-4 border border-blue-950 rounded-2xl space-y-1.5">
                              <h5 className="text-xs font-mono font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                Birth and Background Story
                              </h5>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                                {selectedToken.birthAndBackground}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'idea' && (
                        <motion.div
                          key="idea-tab"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="bg-[#04091a]/40 p-5 border border-blue-950 rounded-3xl space-y-4"
                        >
                          <div className="flex items-center gap-2 border-b border-blue-900/10 pb-3">
                            <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
                              <Lightbulb className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider">How Did the Idea Emerge?</h4>
                              <p className="text-[10px] text-slate-400 font-mono">Founding Vision and Motivations</p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed text-justify">
                            {selectedToken.ideaEmerge}
                          </p>
                        </motion.div>
                      )}

                      {activeTab === 'tech' && (
                        <motion.div
                          key="tech-tab"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="space-y-4"
                        >
                          <div className="bg-[#04091a]/40 p-4 border border-blue-950 rounded-2xl">
                            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                              <Layers className="w-4 h-4 text-emerald-400" />
                              Security & Protocol Innovations
                            </h4>
                            <div className="space-y-3.5">
                              {selectedToken.innovations.map((inn, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 border border-emerald-500/20">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs sm:text-sm text-slate-300 font-medium">{inn}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'popularity' && (
                        <motion.div
                          key="popularity-tab"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="space-y-4"
                        >
                          {/* Summary */}
                          <div className="bg-[#04091a]/40 p-4 border border-blue-950 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4" />
                              Popularity Progression
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                              {selectedToken.popularity}
                            </p>
                          </div>

                          {/* Chronological Milestone Timeline */}
                          <div className="bg-[#04091a]/40 p-4 border border-blue-950 rounded-2xl space-y-3">
                            <h4 className="text-xs font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-900/15 pb-2">
                              <Calendar className="w-4 h-4" />
                              Milestone Timeline
                            </h4>
                            <div className="space-y-4 relative pl-3.5 border-l border-blue-900/30">
                              {selectedToken.timeline.map((event, idx) => (
                                <div key={idx} className="relative space-y-1">
                                  <div className="absolute -left-[19.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#07112b]" />
                                  <p className="text-xs sm:text-sm text-slate-200 font-medium">{event}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ) : (
                    <div className="space-y-6">
                      {/* Render special view for 9_TABLE */}
                      {selectedToken.symbol === '9_TABLE' && (
                        <div className="space-y-6 animate-fade-in text-slate-200">
                          {/* Exquisite Summary Table Header */}
                          <div className="bg-[#050b1a] border-l-4 border-amber-500 rounded-r-2xl p-4.5 space-y-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                              #9 Summary Table / ক্রিপ্টো ইতিহাসের সারাংশ এবং তুলনামূলক সারণী
                            </h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                              A side-by-side historical matrix mapping creators, launch years, and peak popularity epochs of the world's most influential protocol tokens.
                            </p>
                          </div>

                          {/* Highly polished, responsive custom-styled comparison matrix */}
                          <div className="overflow-x-auto rounded-2xl border border-blue-900/45 shadow-lg bg-[#04091a]/80">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-950 to-slate-950 border-b border-blue-900/35 text-[10px] text-amber-400 font-mono font-black uppercase tracking-wider">
                                  <th className="p-4 border-r border-blue-900/20">Token</th>
                                  <th className="p-4 border-r border-blue-900/20">The Founder</th>
                                  <th className="p-4 border-r border-blue-900/20">Launched On</th>
                                  <th className="p-4">Popularity Epoch</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-blue-900/20 font-medium">
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-[#f7931a] flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    Bitcoin
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Satoshi Nakamoto</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2009</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2017</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-blue-400 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    Ethereum
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Vitalik Buterin</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2015</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2017</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-teal-400 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    Tether
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Brock Pierce et al</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2014</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2017</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-blue-500 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    USDC
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Circle & Coinbase</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2018</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2020-21</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-yellow-500 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    BNB
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Changpeng Zhao</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2017</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2021</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-slate-400 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/ripple-xrp-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    XRP
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Chris Larsen & Jed McCaleb</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2012</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2017</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-purple-400 flex items-center gap-1.5">
                                    <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" className="w-4.5 h-4.5 object-contain" referrerPolicy="no-referrer" />
                                    Polygon
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Jaynti Kanani & others</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2017</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2021</td>
                                </tr>
                                <tr className="hover:bg-amber-500/[0.02] transition-colors">
                                  <td className="p-4 font-black border-r border-blue-900/20 text-[#8b5e3c] flex items-center gap-1.5">
                                    <img src="https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg" className="w-4.5 h-4.5 object-contain rounded-md" referrerPolicy="no-referrer" />
                                    Verse
                                  </td>
                                  <td className="p-4 border-r border-blue-900/20 text-slate-200 font-bold">Bitcoin.com</td>
                                  <td className="p-4 font-mono text-center border-r border-blue-900/20">2022</td>
                                  <td className="p-4 font-mono font-black text-amber-500/90 text-center">2022+</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Exquisite Explanatory Memo Card */}
                          <div className="p-4 rounded-2xl border border-blue-900/20 bg-slate-950/40 space-y-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#bd9471] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              System Chronology Note
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed italic pt-1">
                              "Note that the 'year of popularity' of crypto projects is not specific; It generally refers to the period of gaining wide recognition in the market."
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Render special view for 10_PEOPLE */}
                      {selectedToken.symbol === '10_PEOPLE' && (
                        <div className="space-y-6 animate-fade-in text-slate-200">
                          {/* Header Banner */}
                          <div className="bg-[#050b1a] border-l-4 border-[#bd9471] rounded-r-2xl p-4.5 space-y-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#bd9471] animate-pulse" />
                              #10 Three of the most influential people in crypto history / ক্রিপ্টো ইতিহাসের ৩ জন প্রভাবশালী ব্যক্তি
                            </h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                              Profiles of the minds who initiated, generalized, and scaled decentralized technology across the globe.
                            </p>
                          </div>

                          {/* 3 Columns of Influential People Cards with beautiful visual styling and individual labels */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Person 1 */}
                            <div className="bg-gradient-to-b from-[#0f1d3e] to-[#050b1a] border border-amber-500/25 p-5 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 hover:scale-[1.02] hover:border-amber-400 transition-all duration-300 shadow-lg">
                              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-mono font-black text-amber-500 text-lg">
                                1
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-white">Satoshi Nakamoto</h5>
                                <p className="text-[9px] text-[#bd9471] font-mono uppercase font-black tracking-widest mt-0.5">Bitcoin Creator</p>
                              </div>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Creator of Bitcoin and initiator of the blockchain revolution.
                              </p>
                            </div>

                            {/* Person 2 */}
                            <div className="bg-gradient-to-b from-[#0e214c] to-[#050b1a] border border-blue-500/25 p-5 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 hover:scale-[1.02] hover:border-blue-400 transition-all duration-300 shadow-lg">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center font-mono font-black text-blue-450 text-lg">
                                2
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-white">Vitalik Buterin</h5>
                                <p className="text-[9px] text-[#bd9471] font-mono uppercase font-black tracking-widest mt-0.5">Ethereum Founder</p>
                              </div>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Pioneering the era of Smart Contract, DeFi and NFT with Ethereum.
                              </p>
                            </div>

                            {/* Person 3 */}
                            <div className="bg-gradient-to-b from-[#0a233b] to-[#050b1a] border border-teal-500/25 p-5 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 hover:scale-[1.02] hover:border-teal-400 transition-all duration-300 shadow-lg">
                              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/25 flex items-center justify-center font-mono font-black text-teal-400 text-lg">
                                3
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-white">Changpeng Zhao (CZ)</h5>
                                <p className="text-[9px] text-[#bd9471] font-mono uppercase font-black tracking-widest mt-0.5">Binance CEO</p>
                              </div>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Made Binance one of the largest crypto exchanges in the world.
                              </p>
                            </div>
                          </div>

                          {/* Exquisite Summary / Analogy Matrix */}
                          <div className="p-4 rounded-2xl border border-blue-900/30 bg-[#050b1a]/95 space-y-2">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/15">
                              Ecosystem Labels & Definitions / টোকেন সমূহের রূপক পরিচয়
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed font-semibold pt-1">
                              Among these tokens, <span className="text-[#f7931a] font-bold">Bitcoin</span> is commonly referred to as <span className="text-amber-300">"Digital Gold"</span>, <span className="text-blue-400 font-bold">Ethereum</span> as the <span className="text-blue-300">"World's Decentralized Computer"</span>, <span className="text-teal-405 font-bold">USDT/USDC</span> as the <span className="text-teal-300">"Digital Dollar"</span>, <span className="text-yellow-500 font-bold">BNB</span> as the <span className="text-yellow-400">"Binance Ecosystem Token"</span>, <span className="text-slate-401 font-bold">XRP</span> as the <span className="text-slate-300">"Cross-Border Payment Token"</span>, <span className="text-purple-400 font-bold">Polygon</span> as the <span className="text-purple-300">"Ethereum Scaling Network"</span> and <span className="text-[#8b5e3c] font-bold">Verse</span> as the <span className="text-amber-700">"Bitcoin.com Ecosystem Token"</span>.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Clickable Custom "More Details" visual container */}
                <div className="pt-4 border-t border-blue-900/20">
                  <button
                    onClick={() => setShowDetailedModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 hover:from-amber-500/15 border border-amber-500/35 hover:border-amber-400 text-amber-400 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-lg shadow-amber-500/5 group"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      More Details / বিস্তারিত বিবরণ জানুন 📖
                    </span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-mono font-black text-[#bd9471] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/15">
                      WHO • HOW • WHEN • WHY
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#07112b]/50 border border-blue-900/30 rounded-[2.5rem] p-12 text-center h-[520px] flex flex-col items-center justify-center gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 border border-blue-900/30 animate-pulse">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-100 uppercase tracking-wide">No Selection Loaded</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-2 font-medium">
                    Please select a cryptocurrency token from the chronological archive list on the left to review its founder, birth, and detailed discovery story.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* VERBATIM RESEARCH CENTER MODAL (More Details) */}
      <AnimatePresence>
        {showDetailedModal && selectedToken && VERBATIM_DOCS[selectedToken.symbol] && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailedModal(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] bg-[#07112b] border border-amber-500/40 rounded-[2rem] shadow-2xl shadow-yellow-500/15 flex flex-col overflow-hidden text-left z-10 text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-900/30 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 p-1 rounded-xl bg-slate-900 border border-amber-500/35 flex items-center justify-center shrink-0">
                    <img 
                      src={selectedToken.originalLogo} 
                      alt={selectedToken.name} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      {selectedToken.name} Full Profile
                      <span className="text-[9px] text-amber-400 font-mono font-bold border border-amber-500/20 px-1.5 py-0.5 rounded bg-amber-500/5 shrink-0">VERBATIM PROFILE</span>
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Unabridged Cryptographic History & Biography</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailedModal(false)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-900/30 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 bg-gradient-to-b from-[#07112b] to-[#04091c]">
                {/* Founder Presentation Panel (Picture Included) */}
                <div className="flex flex-col sm:flex-row gap-5 bg-slate-950/60 p-5 rounded-2xl border border-amber-500/15 items-center">
                  <img 
                    src={selectedToken.founderPhoto} 
                    alt={selectedToken.founderName} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-amber-500/30 shadow-lg shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center sm:text-left flex-1 space-y-1">
                    <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[#bd9471] rounded-full font-black uppercase">
                      Official Founder Image
                    </span>
                    <h4 className="text-lg font-black text-white tracking-tight">{selectedToken.founderName}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      Main creator and architect behind {selectedToken.name} ({selectedToken.symbol}). Born in {selectedToken.birthPlace !== 'Unknown' ? `${selectedToken.birthPlace}` : 'Unknown background'}.
                    </p>
                  </div>
                </div>

                {/* Verbatim Sections dynamically iterated */}
                {VERBATIM_DOCS[selectedToken.symbol].sections.map((sec, idx) => {
                  const isList = Array.isArray(sec.body);
                  return (
                    <div key={idx} className="bg-slate-950/30 border border-blue-900/20 hover:border-blue-900/40 p-5 rounded-2xl transition-all space-y-2.5">
                      <h4 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {sec.heading}
                      </h4>
                      {isList ? (
                        <div className="space-y-2.5 pl-1">
                          {(sec.body as string[]).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-2.5 items-start">
                              <span className="h-4 w-4 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/15">
                                ✓
                              </span>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                                {bullet}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold pl-1 whitespace-pre-line">
                          {sec.body}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom bar */}
              <div className="p-4 bg-slate-950/60 border-t border-blue-900/30 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
                <span>Ecosystem Education Center</span>
                <button
                  onClick={() => setShowDetailedModal(false)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#03081e] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
