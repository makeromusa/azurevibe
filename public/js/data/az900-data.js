/**
 * AZ-900: Microsoft Azure Fundamentals - Official Knowledge Bank
 * Synchronized with the current Microsoft Learn AZ-900 Skills Outline
 * 
 * Domains:
 * 1. Describe Cloud Concepts (25-30% -> 28%)
 * 2. Describe Azure Architecture and Services (35-40% -> 37%)
 * 3. Describe Azure Management and Governance (30-35% -> 35%)
 */

export const DOMAINS = {
  1: {
    id: 1,
    name: "Cloud Concepts",
    officialTitle: "Describe cloud concepts",
    weight: 0.28,
    color: "#8B5CF6", // Purple Vibe
    badgeClass: "badge-concepts",
    description: "Cloud models, shared responsibility, cloud benefits (elasticity, high availability, agility), and CapEx vs OpEx."
  },
  2: {
    id: 2,
    name: "Azure Architecture & Services",
    officialTitle: "Describe Azure architecture and services",
    weight: 0.37,
    color: "#10B981", // Emerald Vibe
    badgeClass: "badge-architecture",
    description: "Regions, Availability Zones, Resource Groups, Compute (VMs, Containers, Functions), Networking (VNet, VPN, ExpressRoute), and Storage (Blob, Disk, Files, Cosmos DB)."
  },
  3: {
    id: 3,
    name: "Management & Governance",
    officialTitle: "Describe Azure management and governance",
    weight: 0.35,
    color: "#F59E0B", // Amber Vibe
    badgeClass: "badge-governance",
    description: "Cost Management (TCO, Pricing Calculator, Budgets), Governance (Azure Policy, RBAC, Resource Locks), and Monitoring (Azure Monitor, Service Health, Advisor)."
  }
};

export const QUESTIONS = [
  // ==========================================
  // DOMAIN 1: CLOUD CONCEPTS (~28%)
  // ==========================================
  {
    id: "q-c-01",
    domainId: 1,
    topic: "Shared Responsibility Model",
    difficulty: "scenario",
    scenario: "FinTech Africa is migrating an on-premises database to Azure Virtual Machines (IaaS) to handle sudden spikes in holiday transaction volumes.",
    question: "Under the Azure Shared Responsibility Model for Infrastructure as a Service (IaaS), which of the following remains the sole responsibility of FinTech Africa?",
    options: [
      {
        id: "A",
        text: "Physical security of the server racks in the Azure datacenter",
        isCorrect: false,
        explanation: "Incorrect. Physical datacenter security (fences, biometric access, hardware disposal) is always 100% managed by Microsoft across all cloud models (IaaS, PaaS, SaaS)."
      },
      {
        id: "B",
        text: "Operating system security patching, middleware configuration, and data encryption",
        isCorrect: true,
        explanation: "Correct! In IaaS, Microsoft provides the virtualized physical hardware, but the customer is fully responsible for installing, maintaining, and patching the guest operating system, applications, and customer data."
      },
      {
        id: "C",
        text: "Physical host power redundancy and hypervisor patching",
        isCorrect: false,
        explanation: "Incorrect. The physical host machines, underlying hypervisors, and datacenter cooling/power are managed exclusively by Microsoft."
      },
      {
        id: "D",
        text: "Network hardware router replacements in the Azure backbone",
        isCorrect: false,
        explanation: "Incorrect. Physical network cabling and spine switches are physical infrastructure managed entirely by Azure engineers."
      }
    ],
    azureConceptTip: "Remember the IaaS rule: 'You rent the VM hardware, you own the OS and everything inside it.'",
    learnReference: "Microsoft Learn: Describe the shared responsibility model"
  },
  {
    id: "q-c-02",
    domainId: 1,
    topic: "Cloud Benefits: Elasticity vs Scalability",
    difficulty: "intermediate",
    scenario: "An e-commerce startup in Nairobi experiences a massive surge in web traffic every Friday from 6:00 PM to 9:00 PM. During this window, traffic spikes 10x, and then drops back to baseline overnight.",
    question: "Which cloud benefit allows the application to automatically allocate additional virtual compute instances during the surge and deallocate them immediately after the rush to avoid unnecessary costs?",
    options: [
      {
        id: "A",
        text: "High Availability",
        isCorrect: false,
        explanation: "Incorrect. High Availability guarantees that your application remains accessible with minimal downtime (uptime SLA), but it does not describe the automatic scaling up and down of resources."
      },
      {
        id: "B",
        text: "Elasticity",
        isCorrect: true,
        explanation: "Correct! Elasticity is the ability of a cloud system to automatically expand (scale out) and contract (scale in) dynamically based on real-time spikes and drops in workload demand."
      },
      {
        id: "C",
        text: "Geo-distribution",
        isCorrect: false,
        explanation: "Incorrect. Geo-distribution deploys applications across multiple global geographic regions to reduce latency for international users, not dynamic auto-scaling."
      },
      {
        id: "D",
        text: "Disaster Recovery",
        isCorrect: false,
        explanation: "Incorrect. Disaster Recovery refers to recovering data and services following a catastrophe (such as regional power failure or natural disaster)."
      }
    ],
    azureConceptTip: "Scalability is the *capacity* to grow; Elasticity is the *automatic dynamic flexibility* to stretch out and snap back like a rubber band.",
    learnReference: "Microsoft Learn: Describe the benefits of high availability and elasticity in the cloud"
  },
  {
    id: "q-c-03",
    domainId: 1,
    topic: "Expenditure Models: CapEx vs OpEx",
    difficulty: "beginner",
    scenario: "A logistics company wants to modernize its fleet tracking application without spending significant upfront capital on physical server rooms, SAN storage units, and air conditioning.",
    question: "Which financial model does Azure utilize when billing for consumed cloud resources on a monthly pay-as-you-go basis?",
    options: [
      {
        id: "A",
        text: "Capital Expenditure (CapEx)",
        isCorrect: false,
        explanation: "Incorrect. CapEx is the upfront spending on physical hardware and infrastructure (servers, buildings) that is amortized and depreciated over many tax years."
      },
      {
        id: "B",
        text: "Operational Expenditure (OpEx)",
        isCorrect: true,
        explanation: "Correct! Cloud computing operates on an OpEx model. You spend money on services or products as you use them without upfront capital investments, deducting expenses in the same operating tax year."
      },
      {
        id: "C",
        text: "Fixed Asset Depletion (FAD)",
        isCorrect: false,
        explanation: "Incorrect. FAD is an accounting term for extracting natural resources, completely unrelated to cloud infrastructure billing."
      },
      {
        id: "D",
        text: "Residual Amortization",
        isCorrect: false,
        explanation: "Incorrect. Amortization relates to spreading out intangible asset costs, not consumption-based cloud billing."
      }
    ],
    azureConceptTip: "CapEx = Buying the car outright. OpEx = Taking a taxi or ride-share only when you need to travel.",
    learnReference: "Microsoft Learn: Compare capital expenditure (CapEx) with operational expenditure (OpEx)"
  },
  {
    id: "q-c-04",
    domainId: 1,
    topic: "Cloud Models: Hybrid Cloud",
    difficulty: "intermediate",
    scenario: "A national health ministry requires patient medical history records to remain stored strictly inside its own on-premises government datacenter due to statutory privacy laws, while public educational brochures and doctor booking portals are hosted on Azure for public reach.",
    question: "Which cloud deployment model is being described?",
    options: [
      {
        id: "A",
        text: "Public Cloud",
        isCorrect: false,
        explanation: "Incorrect. A pure Public Cloud runs entirely on multi-tenant cloud provider infrastructure with zero on-premises components."
      },
      {
        id: "B",
        text: "Private Cloud",
        isCorrect: false,
        explanation: "Incorrect. A Private Cloud is dedicated solely to a single organization (usually hosted on-premise) and does not utilize a public provider like Azure for public portals."
      },
      {
        id: "C",
        text: "Hybrid Cloud",
        isCorrect: true,
        explanation: "Correct! A Hybrid Cloud combines private infrastructure (on-premises datacenter) with public cloud infrastructure (Azure), allowing data and applications to be shared between them."
      },
      {
        id: "D",
        text: "Isolated Sovereign Perimeter",
        isCorrect: false,
        explanation: "Incorrect. This is not a standardized NIST or Microsoft cloud deployment model."
      }
    ],
    azureConceptTip: "Whenever an architecture combines an existing on-premise datacenter with Azure, the answer is always Hybrid Cloud.",
    learnReference: "Microsoft Learn: Describe the public, private, and hybrid cloud models"
  },

  // ==========================================
  // DOMAIN 2: AZURE ARCHITECTURE & SERVICES (~37%)
  // ==========================================
  {
    id: "q-a-01",
    domainId: 2,
    topic: "Azure Availability Zones",
    difficulty: "scenario",
    scenario: "An agricultural cooperative hosts an online livestock auction platform on Azure Virtual Machines. To protect against localized power failures, flooding, or cooling loss at a datacenter facility, the team needs redundancy within the same Azure Region.",
    question: "Which Azure architectural component physically separates datacenters within a single region with independent power, cooling, and networking?",
    options: [
      {
        id: "A",
        text: "Azure Availability Sets",
        isCorrect: false,
        explanation: "Incorrect. Availability Sets protect against hardware rack and maintenance failures within a single datacenter (fault/update domains), but NOT against an entire datacenter facility failure."
      },
      {
        id: "B",
        text: "Availability Zones",
        isCorrect: true,
        explanation: "Correct! Availability Zones are physically separate datacenters within the same Azure region, each equipped with its own independent power, cooling, and networking connections."
      },
      {
        id: "C",
        text: "Management Groups",
        isCorrect: false,
        explanation: "Incorrect. Management Groups are governance and policy containers above subscriptions, not physical hardware constructs."
      },
      {
        id: "D",
        text: "Resource Groups",
        isCorrect: false,
        explanation: "Incorrect. Resource Groups are logical administrative folders used to organize and lifecycle-manage Azure resources."
      }
    ],
    azureConceptTip: "Availability Zones protect against a *datacenter* going dark. Region Pairs protect against an entire *city/region* going dark.",
    learnReference: "Microsoft Learn: Describe Azure regions, region pairs, and availability zones"
  },
  {
    id: "q-a-02",
    domainId: 2,
    topic: "Compute: Containers vs Virtual Machines",
    difficulty: "intermediate",
    scenario: "A software developer wants to deploy a microservice application without the overhead of configuring, patching, and maintaining a full operating system for each instance.",
    question: "Which Azure service allows you to run containerized applications on-demand without managing any underlying virtual machines or container orchestration clusters?",
    options: [
      {
        id: "A",
        text: "Azure Virtual Machine Scale Sets",
        isCorrect: false,
        explanation: "Incorrect. Scale Sets manage groups of identical full virtual machines (IaaS), which still require OS management and patching."
      },
      {
        id: "B",
        text: "Azure Container Instances (ACI)",
        isCorrect: true,
        explanation: "Correct! Azure Container Instances (ACI) is a serverless container solution that lets you run containers directly without managing virtual machines or setting up a full orchestrator like AKS."
      },
      {
        id: "C",
        text: "Azure Virtual Desktop",
        isCorrect: false,
        explanation: "Incorrect. Azure Virtual Desktop provides virtualized remote Windows desktops for end users, not application container hosting."
      },
      {
        id: "D",
        text: "Azure Synapse Analytics",
        isCorrect: false,
        explanation: "Incorrect. Synapse is an enterprise data warehouse and big data analytics platform."
      }
    ],
    azureConceptTip: "Need single fast container without cluster management? -> ACI. Need full enterprise orchestration with hundreds of pods? -> AKS.",
    learnReference: "Microsoft Learn: Describe Azure container instances and Azure Kubernetes Service"
  },
  {
    id: "q-a-03",
    domainId: 2,
    topic: "Storage: Blob Access Tiers",
    difficulty: "intermediate",
    scenario: "A digital hospital archives X-ray images that must legally be retained for 10 years. These images are rarely accessed after the patient's first month, and when requested, a retrieval latency of several hours is acceptable in exchange for the lowest possible gigabyte storage cost.",
    question: "Which Azure Blob Storage access tier should the hospital select for these historical X-ray records?",
    options: [
      {
        id: "A",
        text: "Hot Tier",
        isCorrect: false,
        explanation: "Incorrect. The Hot tier has the highest storage cost per GB but the lowest access cost, designed for data in active, frequent use."
      },
      {
        id: "B",
        text: "Cool Tier",
        isCorrect: false,
        explanation: "Incorrect. The Cool tier is for data accessed infrequently (held at least 30 days), but its storage cost is higher than Archive."
      },
      {
        id: "C",
        text: "Archive Tier",
        isCorrect: true,
        explanation: "Correct! The Archive tier offers the lowest storage cost per GB but the highest retrieval cost and requires several hours for rehydration (retrieval), making it optimal for long-term historical records."
      },
      {
        id: "D",
        text: "Premium Solid State Tier",
        isCorrect: false,
        explanation: "Incorrect. Premium tier is designed for high-performance, low-latency I/O workloads at the highest cost tier."
      }
    ],
    azureConceptTip: "Archive tier data is offline. You cannot read it instantly; you must 'rehydrate' it first (takes up to 15 hours depending on priority).",
    learnReference: "Microsoft Learn: Describe Azure storage access tiers"
  },
  {
    id: "q-a-04",
    domainId: 2,
    topic: "Networking: ExpressRoute vs VPN Gateway",
    difficulty: "scenario",
    scenario: "A multinational bank requires a dedicated, private, high-bandwidth connection between its head-office on-premises mainframe and Azure without traffic traversing the public internet.",
    question: "Which Azure networking service fulfills this requirement?",
    options: [
      {
        id: "A",
        text: "Azure Site-to-Site VPN Gateway",
        isCorrect: false,
        explanation: "Incorrect. A Site-to-Site VPN connects an on-premises network to Azure through an encrypted tunnel, but the traffic still travels over the public internet."
      },
      {
        id: "B",
        text: "Azure ExpressRoute",
        isCorrect: true,
        explanation: "Correct! Azure ExpressRoute creates a private, dedicated physical connection between your on-premises infrastructure and Azure with the help of a connectivity provider. It does NOT travel over the public internet."
      },
      {
        id: "C",
        text: "Azure Point-to-Site VPN",
        isCorrect: false,
        explanation: "Incorrect. Point-to-Site enables individual remote client computers to connect to a VNet over the public internet."
      },
      {
        id: "D",
        text: "Azure Traffic Manager",
        isCorrect: false,
        explanation: "Incorrect. Traffic Manager is a DNS-based traffic load balancer, not a private physical networking link."
      }
    ],
    azureConceptTip: "Key exam trigger: 'Does NOT traverse the public internet' = ExpressRoute. 'Traverses public internet with encryption' = VPN Gateway.",
    learnReference: "Microsoft Learn: Describe Azure ExpressRoute and virtual network gateways"
  },

  // ==========================================
  // DOMAIN 3: MANAGEMENT & GOVERNANCE (~35%)
  // ==========================================
  {
    id: "q-g-01",
    domainId: 3,
    topic: "Governance: Azure Policy vs RBAC",
    difficulty: "scenario",
    scenario: "An enterprise IT administrator wants to ensure that developers cannot inadvertently deploy expensive Virtual Machines in overseas datacenters outside of the South Africa North or Europe West regions.",
    question: "Which Azure tool should be implemented to enforce this organizational compliance rule automatically across subscriptions?",
    options: [
      {
        id: "A",
        text: "Role-Based Access Control (RBAC)",
        isCorrect: false,
        explanation: "Incorrect. RBAC manages *who* has permission to perform actions (e.g., Kwame can create VMs, Amina can read VMs). It does not evaluate *resource properties* such as allowed regions or SKUs."
      },
      {
        id: "B",
        text: "Azure Policy",
        isCorrect: true,
        explanation: "Correct! Azure Policy enforces organizational standards and assesses compliance across resources (e.g., 'Allowed Locations', 'Allowed Virtual Machine SKUs'). If a developer attempts to create a VM outside approved regions, Policy denies the deployment."
      },
      {
        id: "C",
        text: "Azure Resource Locks",
        isCorrect: false,
        explanation: "Incorrect. Resource Locks prevent resources from being accidentally deleted (CanNotDelete) or modified (ReadOnly), but they do not enforce deployment regions."
      },
      {
        id: "D",
        text: "Microsoft Entra Privileged Identity Management (PIM)",
        isCorrect: false,
        explanation: "Incorrect. PIM manages time-bound, just-in-time elevated role assignments for human administrators."
      }
    ],
    azureConceptTip: "RBAC = 'WHO can do what' (Identity & Roles). Azure Policy = 'WHAT properties can be created' (Compliance, Locations, SKUs).",
    learnReference: "Microsoft Learn: Describe Azure Policy and role-based access control (RBAC)"
  },
  {
    id: "q-g-02",
    domainId: 3,
    topic: "Resource Protection: Resource Locks",
    difficulty: "beginner",
    scenario: "A critical production SQL database must be safeguarded so that administrators with full Owner permissions cannot accidentally delete the resource during routine maintenance.",
    question: "Which feature should be applied directly to the database resource?",
    options: [
      {
        id: "A",
        text: "A 'CanNotDelete' Resource Lock",
        isCorrect: true,
        explanation: "Correct! A 'CanNotDelete' (Delete) lock allows authorized users to read and modify a resource, but completely blocks anyone (even an Owner) from deleting it until the lock is intentionally removed."
      },
      {
        id: "B",
        text: "An Azure Advisor Cost Alert",
        isCorrect: false,
        explanation: "Incorrect. Advisor provides cost and security optimization recommendations; it does not block delete actions."
      },
      {
        id: "C",
        text: "A ReadOnly Resource Lock",
        isCorrect: false,
        explanation: "Incorrect. A ReadOnly lock prevents all updates, writes, and modifications as well as deletes. The scenario asked to protect against accidental deletion while still allowing normal operation."
      },
      {
        id: "D",
        text: "A Service Level Agreement (SLA) Override",
        isCorrect: false,
        explanation: "Incorrect. SLAs are contractual uptime guarantees provided by Microsoft, not administrative lock tools."
      }
    ],
    azureConceptTip: "CanNotDelete = Read & Edit allowed, Delete blocked. ReadOnly = Read only allowed, Edit & Delete blocked.",
    learnReference: "Microsoft Learn: Describe Azure resource locks"
  },
  {
    id: "q-g-03",
    domainId: 3,
    topic: "Cost Planning: Pricing Calculator vs TCO Calculator",
    difficulty: "intermediate",
    scenario: "A Chief Information Officer wants to estimate the total cost savings of retiring their on-premises datacenter over a 5-year period compared to running those workloads on Azure.",
    question: "Which tool should the CIO utilize to compare on-premises physical datacenter operational expenses against cloud projections?",
    options: [
      {
        id: "A",
        text: "Azure Pricing Calculator",
        isCorrect: false,
        explanation: "Incorrect. The Azure Pricing Calculator estimates the expected monthly cost of running specific *Azure services* (e.g., 3 VMs + 1 SQL DB). It does not evaluate on-premises costs."
      },
      {
        id: "B",
        text: "Total Cost of Ownership (TCO) Calculator",
        isCorrect: true,
        explanation: "Correct! The TCO Calculator helps you estimate and compare the total cost of operating an on-premises datacenter (servers, electricity, real estate, labor) versus migrating to Azure over time."
      },
      {
        id: "C",
        text: "Microsoft Cost Management Budgets",
        isCorrect: false,
        explanation: "Incorrect. Cost Management is used after resources are already deployed to monitor actual spend and configure threshold alerts."
      },
      {
        id: "D",
        text: "Azure Service Health",
        isCorrect: false,
        explanation: "Incorrect. Service Health tracks live outages, planned maintenance, and health advisories affecting your subscriptions."
      }
    ],
    azureConceptTip: "TCO Calculator = 'Compare On-Prem vs Azure savings BEFORE migration'. Pricing Calculator = 'Estimate monthly bill for Azure resources'."
  },
  {
    id: "q-g-04",
    domainId: 3,
    topic: "Monitoring: Azure Service Health vs Azure Monitor",
    difficulty: "intermediate",
    scenario: "A DevOps lead receives reports that applications across the Europe North region are timing out. The engineer needs to verify whether Microsoft is experiencing an active widespread cloud outage or scheduled datacenter maintenance affecting Azure services.",
    question: "Where in the Azure portal should the engineer look for official Microsoft service incident reports and regional outages?",
    options: [
      {
        id: "A",
        text: "Azure Monitor Metrics Explorer",
        isCorrect: false,
        explanation: "Incorrect. Azure Monitor tracks the operational performance and telemetry of your own deployed resources (CPU, RAM, logs), not Microsoft's underlying cloud platform status."
      },
      {
        id: "B",
        text: "Azure Service Health",
        isCorrect: true,
        explanation: "Correct! Azure Service Health provides personalized alerts and guidance when Azure service issues, outages, planned maintenance, or health advisories impact your specific subscriptions."
      },
      {
        id: "C",
        text: "Azure Network Watcher Flow Logs",
        isCorrect: false,
        explanation: "Incorrect. Network Watcher inspects IP packet traffic passing through Network Security Groups."
      },
      {
        id: "D",
        text: "Microsoft Purview Compliance Studio",
        isCorrect: false,
        explanation: "Incorrect. Purview is a unified data governance service for discovering and classifying sensitive business data."
      }
    ],
    azureConceptTip: "Azure Monitor = 'Is MY application code or VM running out of memory?' Azure Service Health = 'Did Microsoft's datacenter lose fiber connectivity?'",
    learnReference: "Microsoft Learn: Describe Azure Service Health and Azure Monitor"
  }
];

export const FLASHCARDS = [
  // Cloud Concepts
  {
    id: "fc-c-01",
    domainId: 1,
    term: "Shared Responsibility Model",
    category: "Cloud Concepts",
    quickDefinition: "A security framework dividing operational tasks between the cloud provider (Microsoft) and the customer depending on the service model (IaaS, PaaS, SaaS).",
    realWorldAnalogy: "Renting an apartment: Landlord fixes the roof and outer building (Microsoft); you lock your front door and furnish the rooms (Customer).",
    examTrapWarning: "Physical datacenter security and hardware are ALWAYS Microsoft's responsibility, even in IaaS! Customer data and identity are ALWAYS customer's responsibility, even in SaaS!"
  },
  {
    id: "fc-c-02",
    domainId: 1,
    term: "CapEx vs OpEx",
    category: "Cloud Concepts",
    quickDefinition: "CapEx is upfront capital investment in physical infrastructure. OpEx is ongoing operational expenses billed as consumption without initial capital outlay.",
    realWorldAnalogy: "CapEx is buying a power generator. OpEx is paying the electric bill only for the units of power consumed this month.",
    examTrapWarning: "Cloud computing operates primarily on Operational Expenditure (OpEx). Don't select CapEx for pay-as-you-go cloud billing."
  },
  {
    id: "fc-c-03",
    domainId: 1,
    term: "Elasticity vs Scalability",
    category: "Cloud Concepts",
    quickDefinition: "Scalability is the ability to increase capacity (vertical or horizontal). Elasticity is the ability to automatically expand and contract resources dynamically based on load.",
    realWorldAnalogy: "Scalability is building an extra room on a house. Elasticity is an accordion or rubber band stretching during a musical piece and contracting back.",
    examTrapWarning: "If the question emphasizes 'automatic reduction when traffic drops to save costs', the intended answer is Elasticity."
  },

  // Architecture & Services
  {
    id: "fc-a-01",
    domainId: 2,
    term: "Availability Zones",
    category: "Architecture",
    quickDefinition: "Physically unique, separated datacenters within a single Azure region. Each zone has independent power, cooling, and networking.",
    realWorldAnalogy: "Three independent bank branches in Nairobi, each with its own backup solar generator and separate internet fiber feeds.",
    examTrapWarning: "Availability Sets protect against rack failures inside one building. Availability Zones protect against a whole building/datacenter failing."
  },
  {
    id: "fc-a-02",
    domainId: 2,
    term: "Region Pairs",
    category: "Architecture",
    quickDefinition: "Two regions within the same geography situated at least 300 miles apart to ensure business continuity during catastrophic regional disasters.",
    realWorldAnalogy: "A primary warehouse in Johannesburg paired with a disaster-recovery backup warehouse in Cape Town.",
    examTrapWarning: "Planned Azure platform updates are rolled out to only one region of a paired pair at any given time to avoid concurrent downtime."
  },
  {
    id: "fc-a-03",
    domainId: 2,
    term: "ExpressRoute vs VPN Gateway",
    category: "Architecture",
    quickDefinition: "VPN Gateway routes encrypted traffic across the public internet. ExpressRoute creates a dedicated, private physical line bypassing the public internet.",
    realWorldAnalogy: "VPN is using an armored car on a public public highway. ExpressRoute is building your own private underground tunnel between two estates.",
    examTrapWarning: "Watch out for 'does not traverse the public internet'. If you see that phrase, the answer is always ExpressRoute."
  },
  {
    id: "fc-a-04",
    domainId: 2,
    term: "Blob Storage Access Tiers",
    category: "Architecture",
    quickDefinition: "Hot (frequent access, high storage cost), Cool (infrequent, lower storage, held >= 30 days), Cold (rarely accessed, held >= 90 days), Archive (offline, lowest storage cost, hours to rehydrate).",
    realWorldAnalogy: "Hot is groceries on your kitchen counter. Cool is canned goods in the pantry. Archive is tax folders in a secure underground vault that takes a day to access.",
    examTrapWarning: "Archive tier data cannot be viewed instantly. It must be 'rehydrated' to Hot or Cool before reading."
  },

  // Management & Governance
  {
    id: "fc-g-01",
    domainId: 3,
    term: "Azure Policy vs RBAC",
    category: "Governance",
    quickDefinition: "RBAC focuses on User Identity (WHO can perform actions). Azure Policy focuses on Resource Compliance (WHAT resource properties and locations are permitted).",
    realWorldAnalogy: "RBAC is a security badge letting Kwame enter the building. Azure Policy is the safety rule stating everyone inside must wear hard hats.",
    examTrapWarning: "If the scenario restricts deployment to specific regions (e.g. South Africa North) or blocks certain VM sizes, it is Azure Policy, NOT RBAC."
  },
  {
    id: "fc-g-02",
    domainId: 3,
    term: "Resource Locks (CanNotDelete vs ReadOnly)",
    category: "Governance",
    quickDefinition: "CanNotDelete allows reads and edits but prevents deletion. ReadOnly prevents both modifications and deletions.",
    realWorldAnalogy: "CanNotDelete is like putting an 'Authorized Personnel Only' guard on the shredder. ReadOnly is laminating a document so no one can write or tear it.",
    examTrapWarning: "Resource locks apply even to Subscription Owners! An Owner must explicitly delete the lock before they can delete the locked resource."
  },
  {
    id: "fc-g-03",
    domainId: 3,
    term: "TCO Calculator vs Pricing Calculator",
    category: "Cost Management",
    quickDefinition: "Pricing Calculator estimates ongoing monthly costs of specific Azure resources. TCO Calculator compares on-premises datacenter costs with Azure migration savings.",
    realWorldAnalogy: "Pricing Calculator is checking the monthly rental cost of an apartment. TCO is comparing the total cost of owning and maintaining a house vs renting an apartment for 5 years.",
    examTrapWarning: "Look for 'on-premises comparison' or 'cost savings over time' -> That's TCO Calculator."
  }
];

export const AI_BUDDY_CONCEPTS = [
  {
    id: "concept-shared-resp",
    title: "Shared Responsibility Model (IaaS vs PaaS vs SaaS)",
    domain: "Describe Cloud Concepts",
    tagline: "The Kitchen Analogy (Dining Out, Food Delivery, or Cooking from Scratch)",
    simpleExplanation: "In on-premises computing, you buy the plot, build the kitchen, purchase groceries, cook, and wash dishes. Cloud computing lets you delegate portions of this burden to Microsoft.",
    africanAnalogy: "Think of an event catering in Nairobi:\n• On-Premises: You slaughter the goat, fetch firewood, cook, and clean the pots.\n• IaaS: You rent a fully equipped commercial kitchen with gas and electricity, but you bring your own chef and ingredients.\n• PaaS: You order pre-marinated meat delivered with a professional grill operator; you just serve your guests.\n• SaaS: You and your guests eat at a restaurant buffet. You just consume the food (Microsoft manages the kitchen, staff, and dishes).",
    examTrap: "In SaaS (like Microsoft 365), you don't configure servers or patch software, but YOUR data and YOUR user identities remain YOUR responsibility!"
  },
  {
    id: "concept-regions-zones",
    title: "Regions vs Availability Zones vs Region Pairs",
    domain: "Describe Azure Architecture and Services",
    tagline: "The City, The Suburbs, and The Sister Cities",
    simpleExplanation: "Microsoft organizes physical infrastructure hierarchically to protect workloads against isolated power cuts or catastrophic weather events.",
    africanAnalogy: "Imagine banking across South Africa:\n• Azure Region: The Greater Johannesburg financial hub. It contains multiple datacenters connected by ultra-fast fiber.\n• Availability Zone: Three separate bank vaults located in Sandton, Midrand, and Soweto. If a transformer blows in Sandton, Midrand and Soweto stay fully powered because they have independent electrical sub-stations.\n• Region Pair: Johannesburg paired with Cape Town (over 800 miles away). If a national grid collapse hits Gauteng, disaster recovery failover shifts to Cape Town.",
    examTrap: "Not all Azure regions support Availability Zones! Availability Zones must be within the same region (latency < 2ms)."
  },
  {
    id: "concept-policy-rbac",
    title: "Azure Policy vs Role-Based Access Control (RBAC)",
    domain: "Describe Azure Management and Governance",
    tagline: "The Security Guard vs The Building Code",
    simpleExplanation: "Both tools provide control, but they govern two completely different dimensions: Identity vs Resource Configuration.",
    africanAnalogy: "Think of constructing an office building:\n• RBAC is the security gate pass: It decides whether Amina is an 'Architect' (can design), Kwame is a 'Mason' (can build), or a visitor (view-only).\n• Azure Policy is the municipal building code: It dictates that regardless of who is building, no building can exceed 5 stories, and all plumbing must use copper pipes. Even the chief architect cannot bypass the code.",
    examTrap: "When the exam question asks: 'How do you prevent VMs larger than 8 cores from being spun up?' -> Choose Azure Policy. When it asks: 'How do you allow Kwame to restart VMs but not delete them?' -> Choose RBAC."
  },
  {
    id: "concept-expressroute",
    title: "ExpressRoute vs Site-to-Site VPN",
    domain: "Describe Azure Architecture and Services",
    tagline: "The Private Railway vs The Toll Highway",
    simpleExplanation: "Connecting your on-premises office network to Azure can be done over the internet or via dedicated physical connections.",
    africanAnalogy: "Transporting cargo between Mombasa port and Nairobi:\n• Site-to-Site VPN: You send armored trucks on the public Mombasa-Nairobi highway. The cargo is locked inside heavy steel vaults (encryption), but you still share the road with civilian traffic and weather delays.\n• ExpressRoute: You construct a dedicated private Standard Gauge Railway track directly into your warehouse. No outside cars can enter; the line is private, reliable, and completely bypasses the highway traffic.",
    examTrap: "ExpressRoute does NOT encrypt traffic by default! It is private and bypasses the public internet, but encryption is an optional extra layer if required."
  }
];
