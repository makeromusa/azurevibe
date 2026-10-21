-- ============================================================================
-- AzureVibe: Comprehensive Supabase Seed Data
-- 100% Original Scenario Questions, Flashcards & Concept Analogies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SEED: Questions
-- ----------------------------------------------------------------------------
INSERT INTO public.questions (id, domain_id, topic, difficulty, scenario, question, azure_concept_tip, learn_reference_url)
VALUES
('q-c-01', 1, 'Shared Responsibility Model', 'scenario',
 'FinTech Africa is migrating an on-premises database to Azure Virtual Machines (IaaS) to handle sudden spikes in holiday transaction volumes.',
 'Under the Azure Shared Responsibility Model for Infrastructure as a Service (IaaS), which of the following remains the sole responsibility of FinTech Africa?',
 'Remember the IaaS rule: You rent the VM hardware, you own the OS and everything inside it.',
 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/'),

('q-c-02', 1, 'Cloud Benefits: Elasticity vs Scalability', 'intermediate',
 'An e-commerce startup in Nairobi experiences a massive surge in web traffic every Friday from 6:00 PM to 9:00 PM. During this window, traffic spikes 10x, and then drops back to baseline overnight.',
 'Which cloud benefit allows the application to automatically allocate additional virtual compute instances during the surge and deallocate them immediately after the rush to avoid unnecessary costs?',
 'Scalability is the capacity to grow; Elasticity is the automatic dynamic flexibility to stretch out and snap back like a rubber band.',
 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/'),

('q-c-03', 1, 'Expenditure Models: CapEx vs OpEx', 'beginner',
 'A logistics company wants to modernize its fleet tracking application without spending significant upfront capital on physical server rooms, SAN storage units, and air conditioning.',
 'Which financial model does Azure utilize when billing for consumed cloud resources on a monthly pay-as-you-go basis?',
 'CapEx = Buying the car outright. OpEx = Taking a taxi or ride-share only when you need to travel.',
 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/'),

('q-a-01', 2, 'Azure Availability Zones', 'scenario',
 'An agricultural cooperative hosts an online livestock auction platform on Azure Virtual Machines. To protect against localized power failures, flooding, or cooling loss at a datacenter facility, the team needs redundancy within the same Azure Region.',
 'Which Azure architectural component physically separates datacenters within a single region with independent power, cooling, and networking?',
 'Availability Zones protect against a datacenter going dark. Region Pairs protect against an entire city/region going dark.',
 'https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/'),

('q-a-02', 2, 'Compute: Containers vs Virtual Machines', 'intermediate',
 'A software developer wants to deploy a microservice application without the overhead of configuring, patching, and maintaining a full operating system for each instance.',
 'Which Azure service allows you to run containerized applications on-demand without managing any underlying virtual machines or container orchestration clusters?',
 'Need single fast container without cluster management? -> ACI. Need full enterprise orchestration with hundreds of pods? -> AKS.',
 'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-service-types/'),

('q-a-03', 2, 'Storage: Blob Access Tiers', 'intermediate',
 'A digital hospital archives X-ray images that must legally be retained for 10 years. These images are rarely accessed after the patient''s first month, and when requested, a retrieval latency of several hours is acceptable in exchange for the lowest possible gigabyte storage cost.',
 'Which Azure Blob Storage access tier should the hospital select for these historical X-ray records?',
 'Archive tier data is offline. You cannot read it instantly; you must rehydrate it first (takes up to 15 hours).',
 'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/'),

('q-a-04', 2, 'Networking: ExpressRoute vs VPN Gateway', 'scenario',
 'A multinational bank requires a dedicated, private, high-bandwidth connection between its head-office on-premises mainframe and Azure without traffic traversing the public internet.',
 'Which Azure networking service fulfills this requirement?',
 'Key exam trigger: Does NOT traverse the public internet = ExpressRoute. Traverses public internet with encryption = VPN Gateway.',
 'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/'),

('q-g-01', 3, 'Governance: Azure Policy vs RBAC', 'scenario',
 'An enterprise IT administrator wants to ensure that developers cannot inadvertently deploy expensive Virtual Machines in overseas datacenters outside of the South Africa North or Europe West regions.',
 'Which Azure tool should be implemented to enforce this organizational compliance rule automatically across subscriptions?',
 'RBAC = WHO can do what (Identity & Roles). Azure Policy = WHAT properties can be created (Compliance, Locations, SKUs).',
 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/'),

('q-g-02', 3, 'Resource Protection: Resource Locks', 'beginner',
 'A critical production SQL database must be safeguarded so that administrators with full Owner permissions cannot accidentally delete the resource during routine maintenance.',
 'Which feature should be applied directly to the database resource?',
 'CanNotDelete = Read & Edit allowed, Delete blocked. ReadOnly = Read only allowed, Edit & Delete blocked.',
 'https://learn.microsoft.com/en-us/training/modules/describe-azure-management-governance/'),

('q-g-03', 3, 'Cost Planning: Pricing Calculator vs TCO Calculator', 'intermediate',
 'A Chief Information Officer wants to estimate the total cost savings of retiring their on-premises datacenter over a 5-year period compared to running those workloads on Azure.',
 'Which tool should the CIO utilize to compare on-premises physical datacenter operational expenses against cloud projections?',
 'TCO Calculator = Compare On-Prem vs Azure savings BEFORE migration. Pricing Calculator = Estimate monthly bill for Azure resources.',
 'https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- SEED: Question Options (with Distractor Explanations)
-- ----------------------------------------------------------------------------
INSERT INTO public.question_options (question_id, option_letter, option_text, is_correct, explanation)
VALUES
-- q-c-01
('q-c-01', 'A', 'Physical security of the server racks in the Azure datacenter', FALSE, 'Incorrect. Physical datacenter security (fences, biometric access) is always 100% managed by Microsoft.'),
('q-c-01', 'B', 'Operating system security patching, middleware configuration, and data encryption', TRUE, 'Correct! In IaaS, customer is fully responsible for guest OS, middleware, and customer data.'),
('q-c-01', 'C', 'Physical host power redundancy and hypervisor patching', FALSE, 'Incorrect. Underlying physical hardware and hypervisors are managed exclusively by Microsoft.'),
('q-c-01', 'D', 'Network hardware router replacements in the Azure backbone', FALSE, 'Incorrect. Physical networking cabling and spine switches are managed entirely by Azure engineers.'),

-- q-c-02
('q-c-02', 'A', 'High Availability', FALSE, 'Incorrect. High Availability guarantees uptime SLA, but does not auto-scale resources dynamically.'),
('q-c-02', 'B', 'Elasticity', TRUE, 'Correct! Elasticity is the ability of a cloud system to automatically expand and contract dynamically based on workload demand.'),
('q-c-02', 'C', 'Geo-distribution', FALSE, 'Incorrect. Geo-distribution distributes apps globally to reduce latency, not dynamic auto-scaling.'),
('q-c-02', 'D', 'Disaster Recovery', FALSE, 'Incorrect. Disaster Recovery refers to recovering data and services following a catastrophe.'),

-- q-a-01
('q-a-01', 'A', 'Azure Availability Sets', FALSE, 'Incorrect. Availability Sets protect against rack failures inside one datacenter, NOT an entire datacenter facility failure.'),
('q-a-01', 'B', 'Availability Zones', TRUE, 'Correct! Availability Zones are physically separate datacenters within the same Azure region, each equipped with its own power, cooling, and networking.'),
('q-a-01', 'C', 'Management Groups', FALSE, 'Incorrect. Management Groups are governance and policy containers above subscriptions, not physical hardware constructs.'),
('q-a-01', 'D', 'Resource Groups', FALSE, 'Incorrect. Resource Groups are logical administrative folders, not physical facilities.'),

-- q-a-04
('q-a-04', 'A', 'Azure Site-to-Site VPN Gateway', FALSE, 'Incorrect. Site-to-Site VPN travels across the public internet inside an encrypted tunnel.'),
('q-a-04', 'B', 'Azure ExpressRoute', TRUE, 'Correct! Azure ExpressRoute creates a private, dedicated physical connection between on-premises and Azure without traversing the public internet.'),
('q-a-04', 'C', 'Azure Point-to-Site VPN', FALSE, 'Incorrect. Point-to-Site allows individual remote laptops to connect to a VNet over the public internet.'),
('q-a-04', 'D', 'Azure Traffic Manager', FALSE, 'Incorrect. Traffic Manager is a DNS-based traffic load balancer, not a private physical link.'),

-- q-g-01
('q-g-01', 'A', 'Role-Based Access Control (RBAC)', FALSE, 'Incorrect. RBAC manages WHO has permission to perform actions, not resource properties like allowed regions or SKUs.'),
('q-g-01', 'B', 'Azure Policy', TRUE, 'Correct! Azure Policy evaluates resource properties and enforces organizational rules (like Allowed Locations) across subscriptions.'),
('q-g-01', 'C', 'Azure Resource Locks', FALSE, 'Incorrect. Resource Locks prevent deletion or edits, but do not restrict deployment locations.'),
('q-g-01', 'D', 'Microsoft Entra Privileged Identity Management', FALSE, 'Incorrect. PIM manages time-bound elevated role assignments for human administrators.')
ON CONFLICT (question_id, option_letter) DO NOTHING;

-- ----------------------------------------------------------------------------
-- SEED: Flashcards
-- ----------------------------------------------------------------------------
INSERT INTO public.flashcards (id, domain_id, term, category, quick_definition, real_world_analogy, exam_trap_warning)
VALUES
('fc-c-01', 1, 'Shared Responsibility Model', 'Cloud Concepts',
 'A security framework dividing operational tasks between the cloud provider and the customer depending on service model (IaaS, PaaS, SaaS).',
 'Renting an apartment: Landlord fixes building structure and roof; you lock your door and furnish the rooms.',
 'Physical security is ALWAYS Microsoft responsibility; customer data and identity are ALWAYS customer responsibility!'),

('fc-a-01', 2, 'Availability Zones', 'Architecture',
 'Physically unique, separated datacenters within a single Azure region. Each zone has independent power, cooling, and networking.',
 'Three separate bank branches in Nairobi, each with its own solar backup generator and separate fiber feeds.',
 'Availability Sets protect against rack failures; Availability Zones protect against a whole building/datacenter failing.'),

('fc-a-03', 2, 'ExpressRoute vs VPN Gateway', 'Architecture',
 'VPN Gateway routes encrypted traffic across public internet. ExpressRoute creates a dedicated private physical link bypassing public internet.',
 'VPN is using an armored car on a public highway. ExpressRoute is building your own private underground railway.',
 'Watch out for "does not traverse public internet" -> ExpressRoute. Note that ExpressRoute does NOT encrypt by default.'),

('fc-g-01', 3, 'Azure Policy vs RBAC', 'Governance',
 'RBAC focuses on Identity (WHO can perform actions). Azure Policy focuses on Resource Compliance (WHAT properties and locations are permitted).',
 'RBAC is the security pass to enter the building. Azure Policy is the municipal building code requiring safety hard hats.',
 'If the scenario restricts deployment to specific regions or blocks large VM sizes, it is Azure Policy, NOT RBAC.')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- SEED: Concept Analogies
-- ----------------------------------------------------------------------------
INSERT INTO public.concept_analogies (id, domain_id, title, tagline, simple_explanation, african_analogy, exam_trap)
VALUES
('concept-shared-resp', 1, 'Shared Responsibility Model (IaaS vs PaaS vs SaaS)',
 'The Kitchen Analogy: Dining Out vs Home Cooking',
 'Cloud computing lets you delegate portions of computing burden to Microsoft.',
 'Event catering in Nairobi: On-prem = slaughtering goat, buying firewood, cooking; IaaS = renting equipped kitchen with gas; PaaS = ordering marinated meat with grill chef; SaaS = eating at restaurant buffet.',
 'In SaaS (like Microsoft 365), you don''t patch servers, but YOUR data and YOUR user identities remain YOUR responsibility!'),

('concept-regions-zones', 2, 'Regions vs Availability Zones vs Region Pairs',
 'The City, The Suburbs, and The Sister Cities',
 'Microsoft organizes physical infrastructure hierarchically to protect against localized or regional disasters.',
 'Banking across South Africa: Region = Greater Johannesburg financial hub; Availability Zone = 3 separate vaults in Sandton, Midrand, Soweto with separate power; Region Pair = Johannesburg paired with Cape Town (800 miles away) for failover.',
 'Not all Azure regions support Availability Zones! Availability Zones must be within the same region with latency under 2ms.'),

('concept-policy-rbac', 3, 'Azure Policy vs Role-Based Access Control (RBAC)',
 'The Security Guard vs The Building Code',
 'Both tools provide control, but govern completely different dimensions: Identity vs Resource Configuration.',
 'Constructing an office building: RBAC is the security badge deciding if Amina is an Architect (can design) or Kwame is a Mason (can build). Azure Policy is the municipal building code stating no building can exceed 5 stories, regardless of who builds it.',
 'When asked: "Prevent VMs over 8 cores from being created" -> Azure Policy. When asked: "Allow Kwame to restart VMs but not delete them" -> RBAC.')
ON CONFLICT (id) DO NOTHING;
