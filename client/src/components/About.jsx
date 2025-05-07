import { Badge } from './ui/badge'
import React from 'react';
import { useState } from 'react';

import { AlertTriangle, Book, BookOpen, ChevronRight, Leaf, MapPin, ShieldAlert, Gavel,CheckCircle } from 'lucide-react';
import { AnimatePresence, motion }  from 'framer-motion';


const Card = ({ className, children, ...props }) => (
  <motion.div
    className={`bg-white/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-blue-200/50 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={`p-6 space-y-2 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-2xl font-semibold text-blue-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={`text-gray-600 text-sm ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const About1 = ({ stateName, uniqueBiodiversity, keyLawsAndRestrictions, conservationEfforts, locationFocus }) => {
  return (
    <div className="p-6 m-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-3">
          <Leaf className="w-8 h-8 text-green-500" />
          Protecting {stateName}'s Unique Biodiversity
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Learn about the laws, restrictions, and conservation efforts dedicated to preserving the rich natural heritage of {stateName}.
        </p>
        {locationFocus && (
          <>
            <MapPin className="w-5 h-5 text-red-500 mx-auto mt-4" />
            <p className="text-sm text-gray-500">
              <span className="font-medium">Location Focus:</span> {locationFocus.name}, {locationFocus.coordinates}
            </p>
          </>
        )}
      </motion.div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-green-600 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-400" />
          Unique Biodiversity of {stateName}
        </h2>
        <motion.ul
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="list-disc list-inside space-y-2 text-gray-700"
        >
          {uniqueBiodiversity.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-green-500" />
              {item}
            </li>
          ))}
        </motion.ul>
        <p className="mt-4 text-gray-800">
          <AlertTriangle className="inline-block w-5 h-5 text-yellow-500 mr-1" />
          <span className="font-medium">Important Note:</span> Many of these species are fragile and face threats from habitat loss, climate change, and human activities.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-green-600 flex items-center gap-2">
          <Gavel className="w-6 h-6 text-green-400" />
          Key Laws and Restrictions
        </h2>
        <div className="space-y-4">
          {keyLawsAndRestrictions.map((law, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-blue-400" />
                    {law.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {law.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {law.link ? (
                    <a
                      href={law.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5"
                    >
                      <Book className="w-4 h-4" />
                      Learn More
                    </a>
                  ) : (
                    <p className="text-gray-500">Link not available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-green-600">Conservation Efforts</h2>
        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="list-disc list-inside space-y-2 text-gray-700"
        >
          {conservationEfforts.map((effort, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {effort}
            </li>
          ))}
        </motion.ul>
      </section>

      <div className="mt-8 p-4 bg-green-50/50 border border-green-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-bold">Disclaimer:</span> The information provided here is for general awareness. Always refer to official government sources and legal experts for definitive information and guidance on specific regulations.
        </p>
      </div>
    </div>
  );
};

const stateData = [ {
  stateName: "Uttarakhand",
  uniqueBiodiversity: [
    "Home to rare species like the Himalayan monal (state bird), snow leopard, musk deer, and red fox",
    "Dense oak, rhododendron, deodar, and alpine forests",
    "Part of the Western Himalayas biodiversity hotspot",
    "Rich in medicinal plants and endemic flora",
    "Important migratory route for many bird species"
  ],
  keyLawsAndRestrictions: [
    {
      title: "The Wildlife Protection Act, 1972",
      description: "Provides legal framework for protection of wildlife and establishment of protected areas across Uttarakhand.",
      link: "https://legislative.gov.in/sites/default/files/A1972-53.pdf"
    },
    {
      title: "Forest (Conservation) Act, 1980",
      description: "Regulates deforestation and diversion of forest land for non-forest purposes, crucial in the hilly regions of Uttarakhand.",
      link: "https://legislative.gov.in/sites/default/files/A1980-69.pdf"
    },
    {
      title: "Uttarakhand Biodiversity Rules, 2015",
      description: "State-specific rules to manage, conserve, and promote sustainable use of biodiversity.",
      link: "https://uttarakhand.gov.in/"
    },
    {
      title: "Eco-sensitive Zone Regulations",
      description: "Protect fragile ecosystems around national parks and wildlife sanctuaries from unregulated development.",
      link: ""
    }
  ],
  conservationEfforts: [
    "Eco-restoration projects in degraded forest areas",
    "Snow leopard conservation under SECURE Himalaya project",
    "Establishment of Van Panchayats for local forest management",
    "Promotion of eco-tourism with local community participation",
    "Creation of biosphere reserves like Nanda Devi and Valley of Flowers"
  ],
  locationFocus: {
    name: "Valley of Flowers National Park",
    coordinates: "30.7280° N, 79.6050° E"
  }
},
  {
    stateName: 'Kerala',
    uniqueBiodiversity: [
      'Tropical Evergreen Forests of the Western Ghats',
      'Endemic species like Nilgiri Tahr and Lion-tailed Macaque',
      'Mangrove ecosystems and backwaters',
      'Rare medicinal plants and orchids',
      'Rich avian diversity including Malabar Grey Hornbill'
    ],
    keyLawsAndRestrictions: [
      {
        title: 'The Kerala Forest Act, 1961',
        description: 'Regulates forest conservation, wildlife protection, and forest produce in Kerala.',
        link: 'https://www.keralaforest.org/'
      },
      {
        title: 'The Biological Diversity Act, 2002',
        description: 'Promotes conservation, sustainable use, and equitable benefit-sharing of biodiversity.',
        link: 'https://nbaindia.org/'
      },
      {
        title: 'The Wildlife Protection Act, 1972',
        description: 'Protects endangered flora and fauna and creates protected areas like sanctuaries and national parks.',
        link: 'https://moef.gov.in/en/division/environment-divisions/wildlife-and-biodiversity/'
      }
    ],
    conservationEfforts: [
      'Silent Valley National Park conservation success',
      'Community-based ecotourism initiatives',
      'Mangrove regeneration projects',
      'Sacred groves and people’s biodiversity registers',
      'Western Ghats conservation under UNESCO World Heritage Site'
    ],
    locationFocus: {
      name: 'Silent Valley National Park',
      coordinates: '11.0644° N, 76.4700° E'
    }
  }
  ,{
  stateName: 'Arunachal Pradesh',
  uniqueBiodiversity: [
    'Eastern Himalayan Biodiversity Hotspot',
    'Rare orchids (over 600 species)',
    'Mishmi Hills home to Red Panda and Mishmi Takin',
    'Clouded Leopard, Hornbills, and Bengal Tiger',
    'Alpine meadows and subtropical forests'
  ],
  keyLawsAndRestrictions: [
    {
      title: 'The Arunachal Pradesh Forest Act, 1983',
      description: 'Protects forest lands and governs forest produce in Arunachal Pradesh.',
      link: 'https://arunachalforests.gov.in/'
    },
    {
      title: 'The Wildlife Protection Act, 1972',
      description: 'Central act applied in the state to protect endangered species and biodiversity.',
      link: 'https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972'
    },
    {
      title: 'The Biological Diversity Act, 2002',
      description: 'Establishes the Arunachal Pradesh Biodiversity Board for biodiversity conservation.',
      link: 'https://arunachalbiodiversityboard.in/'
    }
  ],
  conservationEfforts: [
    'Community conservation efforts in tribal areas',
    'Establishment of Pakke and Namdapha National Parks',
    'Hornbill Nest Adoption Program (HNAP)',
    'Wildlife corridors to mitigate habitat fragmentation',
    'Sustainable forest-based livelihoods'
  ],
  locationFocus: {
    name: 'Namdapha National Park',
    coordinates: '27.4911° N, 96.3841° E'
  }
}
,
  {
    stateName: 'Maharashtra',
    uniqueBiodiversity: [
      'Western Ghats evergreen forests in Sahyadris',
      'Tadoba Andhari Tiger Reserve species like Bengal Tiger, Leopard, and Gaur',
      'Marine biodiversity along Konkan coast',
      'Rare reptiles like Deccan Banded Gecko',
      'Grasslands supporting Indian Bustard'
    ],
    keyLawsAndRestrictions: [
      {
        title: 'The Maharashtra Forest Rules, 1963',
        description: 'Regulates the conservation and management of forests in the state.',
        link: 'https://mahaforest.gov.in/'
      },
      {
        title: 'The Wildlife Protection Act, 1972',
        description: 'Framework for protection of wildlife and establishment of protected areas.',
        link: 'https://moef.gov.in/'
      },
      {
        title: 'The Maharashtra Biological Diversity Rules, 2008',
        description: 'Implements the Biological Diversity Act at state level.',
        link: 'https://mahabiodiversityboard.in/'
      }
    ],
    conservationEfforts: [
      'Tiger conservation in Tadoba and Melghat',
      'Mangrove cell for coastal ecosystem protection',
      'Great Indian Bustard recovery program',
      'Urban biodiversity initiatives like Mumbai’s Aarey Forest',
      'Eco-sensitive zones around protected areas'
    ],
    locationFocus: {
      name: 'Tadoba Andhari Tiger Reserve',
      coordinates: '20.2408° N, 79.3792° E'
    }
  }
  
];

export const StateInfoSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-10">
      {stateData.map((state, index) => (
        <motion.div layout key={index}>
          <Card
            onClick={() => toggleCard(index)}
            className="cursor-pointer group m-10 "
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Leaf className="text-green-500" />
                  {state.stateName}
                </CardTitle>
                <CardDescription>
                  {state.uniqueBiodiversity[0]}
                </CardDescription>
              </div>
              <ChevronRight
                className={`w-6 h-6 text-gray-500 group-hover:text-green-500 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-90" : ""
                }`}
              />
            </CardHeader>
          </Card>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-t-0 rounded-t-none">
                  <About1 {...state} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};





