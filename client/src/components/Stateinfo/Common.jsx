import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Book, BookOpen, ChevronRight, Leaf, MapPin, ShieldAlert, Gavel, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

// Re-styled Card component
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <motion.div
        className={cn(
            "bg-white/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg transition-all duration-300",
            "hover:shadow-xl hover:scale-[1.01] hover:border-blue-200/50",
            className
        )}
        {...props}
    >
        {children}
    </motion.div>
);

// Re-styled CardHeader component
const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6 space-y-2", className)} {...props}>
        {children}
    </div>
);

// Re-styled CardTitle component
const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn(
        "text-2xl font-semibold text-blue-900",
        className
    )} {...props}>
        {children}
    </h3>
);

// Re-styled CardDescription component
const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn(
        "text-gray-600 text-sm",
        className
    )} {...props}>
        {children}
    </p>
);

// Re-styled CardContent component
const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6", className)} {...props}>
        {children}
    </div>
);

// --- Component for Each State ---

const StateBiodiversityPage = ({
    stateName,
    uniqueBiodiversity,
    keyLawsAndRestrictions,
    conservationEfforts,
    locationFocus
}: {
    stateName: string;
    uniqueBiodiversity: string[];
    keyLawsAndRestrictions: any[];
    conservationEfforts: string[];
    locationFocus?: { name: string; coordinates: string; }
}) => {
    return (
        <div className="p-6">
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
                    <span className="font-medium">Important Note:</span>  Many of these species are fragile and face threats from habitat loss, climate change, and human activities.
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
                    <span className="font-bold">Disclaimer:</span> The information provided here is for general awareness.  Always refer to official government sources and legal experts for definitive information and guidance on specific regulations.
                </p>
            </div>
        </div>
    );
};

const BiodiversityPages = () => {
    // Dummy data for different states.  Replace with actual data.
    const stateData = [
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
                    link: "#", // Add real link
                },
                {
                    title: "Kerala Conservation of Biodiversity Rules, 2004",
                    description: "Implements the Biological Diversity Act, 2002 in Kerala.",
                    link: "#", // Add real link
                },
                {
                  title: "The Kerala State Biodiversity Board",
                  description: "Works for the conservation of biological diversity",
                  link: "#"
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
            stateName: "Arunachal Pradesh",
            uniqueBiodiversity: [
                "Eastern Himalayan broadleaf forests",
                "Subalpine and alpine ecosystems",
                "Rich diversity of orchids",
                "Endangered species like the Red Panda and various pheasant species",
                "Home to the Namdapha flying squirrel"
            ],
            keyLawsAndRestrictions: [
                {
                    title: "Arunachal Pradesh Forest Regulation Act, 1948",
                    description: "Regulates forest management.",
                    link: "#"
                },
                {
                  title: "The Arunachal Pradesh Biodiversity Board",
                  description: "Implements the Biological Diversity Act, 2002",
                  link: "#"
                },
                {
                  title: "Wildlife Protection Act, 1972",
                  description: "Applicable in the state for protection of wildlife.",
                  link: "https://en.wikipedia.org/wiki/Wildlife_Protection_Act,_1972"
                }
            ],
            conservationEfforts: [
                "Establishment of Namdapha National Park and other protected areas",
                "Community-based conservation programs",
                "Efforts to protect endangered species",
            ],
            locationFocus: { name: "Namdapha National Park", coordinates: "27.3333° N, 96.5000° E" }
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
                    link: "#"
                },
                {
                  title: "Maharashtra State Biodiversity Board",
                  description: "Implements the Biological Diversity Act, 2002",
                  link: "#"
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

    return (
        <div>
            {stateData.map((state, index) => (
                <StateBiodiversityPage
                    key={index}
                    stateName={state.stateName}
                    uniqueBiodiversity={state.uniqueBiodiversity}
                    keyLawsAndRestrictions={state.keyLawsAndRestrictions}
                    conservationEfforts={state.conservationEfforts}
                    locationFocus={state.locationFocus}
                />
            ))}
        </div>
    );
};

export default BiodiversityPages;
