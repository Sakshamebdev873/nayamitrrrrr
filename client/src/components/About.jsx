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

  const stateData = [

{
    stateName: "Andaman and Nicobar Islands",
    uniqueBiodiversity: [
    "Coral reefs",
    "Mangroves",
    "Endemic bird species like the Narcondam Hornbill and Nicobar Pigeon",
    "Diverse marine life"
    ],
    keyLawsAndRestrictions: [
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://www.drishtiias.com/to-the-points/paper3/biological-diversity-act-2002" },
    { title: "Andaman and Nicobar Islands Forest Regulation, 1966", description: "Regulates forest management.", link: "https://www.indiacode.nic.in/bitstream/123456789/18989/1/1_9_6_6.pdf" }
    ],
    conservationEfforts: [
    "Establishment of marine national parks and wildlife sanctuaries",
    "Coral reef conservation projects",
    "Protection of nesting sites for sea turtles"
    ],
    locationFocus: { name: "Mahatma Gandhi Marine National Park", "coordinates": "11.5667° N, 92.5667° E" }
},
{
    stateName: "Andhra Pradesh",
    "uniqueBiodiversity": [
    "Eastern Ghats flora and fauna",
    "Endemic plants like Red Sanders (Pterocarpus santalinus)",
    "Diverse birdlife including Jerdon's Courser",
    "Significant mangrove ecosystems"
    ],
    keyLawsAndRestrictions: [
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://www.indiacode.nic.in/bitstream/123456789/2046/4/a2003-18.pdf" },
    { title: "Andhra Pradesh Forest Act, 1967", description: "Regulates forest management.", link: "https://www.indiacode.nic.in/bitstream/123456789/16404/1/act_no_1_of_1967.pdf" }
    ],
    conservationEfforts: [
    "Tiger conservation in Nagarjuna Sagar-Srisailam Tiger Reserve",
    "Protection of mangrove forests",
    "Conservation of endemic flora"
    ],
    locationFocus: { name: "Nagarjuna Sagar-Srisailam Tiger Reserve", coordinates: "16.5000° N, 79.0000° E" }
},
{
    stateName: "Arunachal Pradesh",
    uniqueBiodiversity: [
    "Eastern Himalayan broadleaf forests",
    "Subalpine and alpine ecosystems",
    "Rich diversity of orchids",
    "Endangered species like the Red Panda and various pheasant species",
    "Home to the Namdapha flying squirrel"
    ],
    keyLawsAndRestrictions: [
    { title: "Arunachal Pradesh Forest Regulation Act, 1948", description: "Regulates forest management.", link: "https://arunachalforests.gov.in/acts-rules.html" },
    { title: "The Arunachal Pradesh Biodiversity Board", description: "Implements the Biological Diversity Act, 2002", link: "https://arunachalforests.gov.in/acts-rules.html" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable in the state for protection of wildlife.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" }
    ],
    conservationEfforts: [
    "Establishment of Namdapha National Park and other protected areas",
    "Community-based conservation programs",
    "Efforts to protect endangered species"
    ],
    locationFocus: { name: "Namdapha National Park", coordinates: "27.3333° N, 96.5000° E" }
},
{
    stateName: "Assam",
    uniqueBiodiversity: [
    "Brahmaputra Valley biodiversity",
    "One-horned rhinoceros",
    "Diverse primate species",
    "Rich avifauna"
    ],
    keyLawsAndRestrictions: [
    { title: "Assam Forest Regulation, 1891", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Rhino conservation in Kaziranga National Park",
    "Elephant conservation",
    "Protection of wetland ecosystems"
    ],
    locationFocus: { name: "Kaziranga National Park", coordinates: "26.5000° N, 93.2000° E" }
},
{
    stateName: "Bihar",
    uniqueBiodiversity: [
    "Gangetic plains biodiversity",
    "Various freshwater fish species",
    "Important habitat for migratory birds",
    "Presence of Gangetic dolphins"
    ],
    keyLawsAndRestrictions: [
    { title: "Bihar Forest Act, 1981", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Efforts to conserve Gangetic dolphins",
    "Protection of wetlands and bird sanctuaries",
    "Afforestation programs"
    ],
    locationFocus: { name: "Valmiki National Park", coordinates: "27.4000° N, 84.2500° E" }
},
{
    stateName: "Chandigarh",
    uniqueBiodiversity: [
    "Urban biodiversity",
    "Sukhna Lake ecosystem",
    "Variety of bird species",
    "Flora of the Shivalik foothills"
    ],
    keyLawsAndRestrictions: [
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" },
    { title: "Chandigarh Forest Rules, 1954", description: "Regulates forest management.", link: "https://chandigarh.gov.in/sites/default/files/documents/dev-control.pdf" }
    ],
    conservationEfforts: [
    "Management of Sukhna Wildlife Sanctuary",
    "Urban greening initiatives",
    "Protection of local flora and fauna"
    ],
    locationFocus: { name: "Sukhna Wildlife Sanctuary", coordinates: "30.7418° N, 76.8281° E" }
},
{
    stateName: "Chhattisgarh",
    uniqueBiodiversity: [
    "Central Indian tropical moist and dry deciduous forests",
    "Wild buffalo",
    "Hill myna",
    "Rich tribal biodiversity knowledge"
    ],
    keyLawsAndRestrictions: [
    { title: "Chhattisgarh Forest Act, 1968", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Protection of wild buffalo",
    "Management of national parks and wildlife sanctuaries",
    "Community involvement in forest management"
    ],
    locationFocus: { name: "Kanger Valley National Park", coordinates: "18.8333° N, 82.0000° E" }
},
{
    stateName: "Dadra and Nagar Haveli and Daman and Diu",
    uniqueBiodiversity: [
    "Western Ghats influence",
    "Moist deciduous forests",
    "Coastal ecosystems",
    "Variety of avifauna"
    ],
    keyLawsAndRestrictions: [
    { title: "Indian Forest Act, 1927 (as applicable)", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Protection of forest areas",
    "Coastal conservation efforts",
    "Wildlife management in sanctuaries"
    ],
    locationFocus: { name: "Daman Ganga Wildlife Sanctuary", coordinates: "20.2833° N, 73.0167° E" }
},
{
    stateName: "Delhi",
    uniqueBiodiversity: [
    "Ridge biodiversity",
    "Urban forests",
    "Variety of bird species in urban and peri-urban areas",
    "Yamuna River biodiversity"
    ],
    keyLawsAndRestrictions: [
    { title: "Delhi Forest Act, 1994", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Development and management of biodiversity parks",
    "Afforestation efforts in the Delhi Ridge",
    "Yamuna River conservation projects"
    ],
    locationFocus: { name: "Asola Bhatti Wildlife Sanctuary", coordinates: "28.4667° N, 77.2000° E" }
},
{
    stateName: "Goa",
    uniqueBiodiversity: [
    "Western Ghats biodiversity hotspot",
    "Endemic flora and fauna",
    "Coastal and marine biodiversity",
    "Rich diversity of birds"
    ],
    keyLawsAndRestrictions: [
    { title: "Goa, Daman and Diu Forest Act, 1984", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Protection of Western Ghats forests",
    "Conservation of coastal ecosystems",
    "Wildlife sanctuaries and national parks"
    ],
    locationFocus: { name: "Bhagwan Mahavir Wildlife Sanctuary and Mollem National Park", coordinates: "15.3333° N, 74.2000° E" }
},
{
    stateName: "Gujarat",
    uniqueBiodiversity: [
    "Gir Forest (Asiatic lions)",
    "Coastal and marine biodiversity in the Gulf of Kutch",
    "Rann of Kutch (unique desert ecosystem)",
    "Diverse birdlife"
    ],
    keyLawsAndRestrictions: [
    { title: "Gujarat Forest Act, 1927 (as applicable)", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Asiatic lion conservation project",
    "Marine protected areas in the Gulf of Kutch",
    "Conservation efforts in the Rann of Kutch"
    ],
    locationFocus: { name: "Gir National Park", coordinates: "21.1333° N, 70.8333° E" }
},
{
    stateName: "Haryana",
    uniqueBiodiversity: [
    "Northern plains biodiversity",
    "Wetlands and bird habitats",
    "Relict Aravali vegetation",
    "Diverse agricultural biodiversity"
    ],
    keyLawsAndRestrictions: [
    { title: "Indian Forest Act, 1927 (as applicable)", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Management of Sultanpur National Park (bird sanctuary)",
    "Afforestation programs",
    "Wetland conservation"
    ],
    locationFocus: { name: "Sultanpur National Park", coordinates: "28.4717° N, 76.8950° E" }
},
{
    stateName: "Himachal Pradesh",
    uniqueBiodiversity: [
    "Western Himalayan biodiversity",
    "Temperate and alpine forests",
    "Variety of medicinal plants",
    "Snow leopard habitat"
    ],
    keyLawsAndRestrictions: [
    { title: "Himachal Pradesh Forest Act, 1968", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Snow leopard conservation projects",
    "Protection of high-altitude ecosystems",
    "Conservation of medicinal plants"
    ],
    locationFocus: { name: "Great Himalayan National Park", coordinates: "31.7667° N, 77.5000° E" }
},
{
    stateName: "Jammu and Kashmir",
    uniqueBiodiversity: [
    "Western Himalayan biodiversity",
    "High-altitude wetlands",
    "Variety of endemic flora and fauna",
    "Habitat for the Kashmir stag (Hangul)"
    ],
    keyLawsAndRestrictions: [
    { title: "Jammu and Kashmir Forest Act, 1930", description: "Regulates forest management.", link: "#" },
    { title: "Wildlife Protection Act, 1972", description: "Applicable for wildlife protection.", link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972" },
    { title: "Biological Diversity Act, 2002", description: "For conservation of biological diversity.", link: "https://arunachalforests.gov.in/acts-rules.html" }
    ],
    conservationEfforts: [
    "Hangul conservation project",
    "Protection of high-altitude wildlife",
    "Wetland conservation"
    ],
    locationFocus: { name: "Dachigam National Park", coordinates: "34.1000° N, 75.0833° E" }
},


        //this is starting
        {
            stateName: "Uttarakhand",
            uniqueBiodiversity: [
                "Western Himalayan Subalpine Forests",
                "Alpine Meadows",
                "Rare medicinal plants",
                "Endangered species like the Snow Leopard and Himalayan Monal",
                "Diverse orchid species",
            ],
            keyLawsAndRestrictions: [
                {
                    title: "The Wildlife Protection Act, 1972",
                    description: "Provides the framework for the protection of wild animals, birds and plants.",
                    link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972",
                },
                {
                    title: "The Forest Act, 1927",
                    description: "Governs the conservation of forests and regulation of the transit of forest produce.",
                    link: "https://en.wikipedia.org/wiki/Indian_Forest_Act,_1927",
                },
                {
                    title: "Uttarakhand Biodiversity Board",
                    description: "Implements the Biological Diversity Act, 2002",
                    link: "https://ukbiodiversityboard.org/",
                },
            ],
            conservationEfforts: [
                "Establishment of National Parks and Wildlife Sanctuaries",
                "Project Tiger and other species-specific programs",
                "Community-based conservation initiatives",
            ],
            locationFocus: { name: "Reserve Forest Range Ranik", coordinates: "29.6565° N, 79.4187° E" }
        },
        {
            stateName: "Kerala",
            uniqueBiodiversity: [
                "Tropical rainforests of the Western Ghats",
                "Backwaters and coastal ecosystems",
                "Diverse spice plantations",
                "Endangered species like the Nilgiri Tahr and Lion-tailed Macaque",
                "A variety of fish and bird species"
            ],
            keyLawsAndRestrictions: [
                {
                    title: "Kerala Forest Act, 1961",
                    description: "Regulates forest management and conservation in Kerala.",
                    link: "https://www.bing.com/search?q=Kerala+Conservation+of+Biodiversity+Rules%2C+2004&cvid=cd30623aae33498599ed8ba5abd5dcae&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzYzMmowajSoAgiwAgE&FORM=ANAB01&PC=ASTS", // Add real link
                },
                {
                    title: "Kerala Conservation of Biodiversity Rules, 2004",
                    description: "Implements the Biological Diversity Act, 2002 in Kerala.",
                    link: "https://www.bing.com/search?q=Kerala+Conservation+of+Biodiversity+Rules%2C+2004&cvid=cd30623aae33498599ed8ba5abd5dcae&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzYzMmowajSoAgiwAgE&FORM=ANAB01&PC=ASTS", // Add real link
                },
                {
                title: "The Kerala State Biodiversity Board",
                description: "Works for the conservation of biological diversity",
                link: "https://www.bing.com/search?q=Kerala+Conservation+of+Biodiversity+Rules%2C+2004&cvid=cd30623aae33498599ed8ba5abd5dcae&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzYzMmowajSoAgiwAgE&FORM=ANAB01&PC=ASTS"
                }
            ],
            conservationEfforts: [
                "Establishment of Wildlife Sanctuaries and National Parks (e.g., Eravikulam National Park, Periyar National Park)",
                "Conservation of mangroves and backwaters",
                "Sustainable tourism initiatives",
            ],
            locationFocus: { name: "Silent Valley National Park", coordinates: "11.0667° N, 76.4167° E" }
        },
        
        
        {
            stateName: "Maharashtra",
            uniqueBiodiversity: [
                "Western Ghats biodiversity hotspot",
                "Deccan Plateau ecosystems",
                "Coastal and marine biodiversity",
                "Endangered species like the tiger and Indian giant squirrel",
                "Variety of medicinal plants"
            ],
            keyLawsAndRestrictions: [
                {
                    title: "Maharashtra Forest Act, 1927",
                    description: "Governs forest management and conservation.",
                    link: "https://mahaforest.gov.in/index.php/codemanual"
                },
                {
                  title: "Maharashtra State Biodiversity Board",
                  description: "Implements the Biological Diversity Act, 2002",
                  link: "https://mahaforest.gov.in/index.php/codemanual"
                },
                {
                  title: "Wildlife Protection Act, 1972",
                  description: "Applicable for protection of wildlife.",
                  link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972"
                }
            ],
            conservationEfforts: [
                "Establishment of Tiger Reserves (e.g., Tadoba-Andhari Tiger Reserve)",
                "Protection of marine biodiversity",
                "Community-based conservation initiatives",
            ],
            locationFocus: {name: "Western Ghats", coordinates: "16.0000° N, 75.0000° E"}
        }
    ];


// import React, { useState } from 'react';

const StateInfo = ({ biodiversityData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = stateData.filter(state =>
    state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        placeholder="Search state..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: '400px',
          fontSize: '1rem'
        }}
      />

      {filteredStates.map((state, index) => (
        <div key={index} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
          <h2>{state.stateName}</h2>
          <p><strong>Location Focus:</strong> {state.locationFocus.name} ({state.locationFocus.coordinates})</p>

          <h4>Unique Biodiversity:</h4>
          <ul>
            {state.uniqueBiodiversity.map((item, i) => <li key={i}>{item}</li>)}
          </ul>

          <h4>Key Laws & Restrictions:</h4>
          <ul>
            {state.keyLawsAndRestrictions.map((law, i) => (
              <li key={i}>
                <strong>{law.title}</strong>: {law.description} – <a href={law.link} target="_blank" rel="noreferrer">Learn more</a>
              </li>
            ))}
          </ul>

          <h4>Conservation Efforts:</h4>
          <ul>
            {state.conservationEfforts.map((effort, i) => <li key={i}>{effort}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
};




export const StateInfoSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCard = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Filter the states based on search input
  const filteredStates = stateData.filter((state) =>
    state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-center items-start my-10 text-blue-900/90 mx-13 space-y-5 ">
        <div className="flex justify-between items-center w-full px-6">
          <h1 className=" animate-pulse text-3xl mb-2 font-serif font-bold">
            This Is A List Of Laws Specific To States:
          </h1>
      
        <input
          type="text"
          placeholder="Search state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none outline-1 mb-7 hover:bg-blue-100 hover:tracking-widest duration-300 border-gray-300 rounded-md px-4 py-2 w-full max-w-md mt-4"
        />
        </div>
      </div>

      {filteredStates.length === 0 ? (
        <p className="text-center text-gray-500">No states found.</p>
      ) : (
        filteredStates.map((state, index) => (
          <motion.div layout key={index}>
            <Card
              onClick={() => toggleCard(index)}
              className="cursor-pointer group m-10"
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
        ))
      )}
    </div>
  );
};

