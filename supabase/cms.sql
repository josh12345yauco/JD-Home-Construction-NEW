CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_image TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  detailed_description TEXT DEFAULT '',
  process_steps TEXT DEFAULT '',
  benefits TEXT DEFAULT '',
  timeline_estimate TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  project_title TEXT NOT NULL,
  category TEXT DEFAULT '',
  location TEXT DEFAULT '',
  scope_of_work TEXT DEFAULT '',
  project_description TEXT DEFAULT '',
  before_image TEXT DEFAULT '',
  after_image TEXT DEFAULT '',
  media_gallery JSONB DEFAULT '[]',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.services (id, service_name, service_image, short_description, detailed_description, process_steps, benefits, timeline_estimate, display_order) VALUES
('4ac9e78b-4988-4973-a2e3-8bb307df0c49', 'Bathrooms', '/images/service-bathrooms.jpg', 'Renovations & full Build-outs', 'From minor updates to complete overhauls, we specialize in creating stunning bathrooms. Our services include design consultation, demolition, plumbing and electrical work, tile installation, fixture selection and installation, custom cabinetry, and painting. We handle everything from small powder rooms to large master ensuites, ensuring high-quality finishes and efficient project management.', '1. Initial Consultation & Design; 2. Material Selection & Budgeting; 3. Demolition & Preparation; 4. Plumbing & Electrical Rough-in; 5. Framing & Drywall; 6. Tiling & Flooring; 7. Fixture Installation; 8. Painting & Finishing; 9. Final Inspection & Handover.', 'Increased home value, improved functionality, enhanced aesthetics, personalized design, durable and high-quality materials, professional project management.', '3-6 weeks depending on scope', 1),
('1823312c-339b-43ef-9662-1277b00b7a2c', 'Kitchens', '/images/service-kitchens.jpg', 'Renovations & full build-outs', 'We offer end-to-end kitchen solutions, from contemporary designs to classic remodels. Our team manages all aspects, including space planning, custom cabinetry, countertop installation (granite, quartz, marble), appliance integration, lighting design, flooring, and backsplash installation.', '1. Design Consultation & Layout Planning; 2. Material & Appliance Selection; 3. Demolition & Site Preparation; 4. Plumbing & Electrical Updates; 5. Cabinet Installation; 6. Countertop Templating & Installation; 7. Appliance & Fixture Installation; 8. Backsplash & Flooring; 9. Painting & Finishing; 10. Final Walkthrough.', 'Modernized living space, increased property value, improved cooking experience, better organization, energy-efficient options, custom solutions.', '4-8 weeks depending on complexity', 2),
('1e4ace39-d84a-4d91-a9e8-709876055ceb', 'Interiors', '/images/service-interiors.jpg', 'Framing, Drywall, painting, Mill-Work', 'Our interior services lay the foundation and add the finishing touches to any space. We provide precise framing for structural integrity, seamless drywall installation and finishing, professional painting services for a flawless look, and custom millwork including trim, molding, wainscoting, and built-ins.', '1. Site Preparation & Protection; 2. Framing & Structural Work; 3. Electrical & Plumbing Rough-in (if applicable); 4. Drywall Installation & Taping; 5. Priming & Painting; 6. Millwork Fabrication & Installation; 7. Final Touches & Clean-up.', 'Strong structural foundation, smooth and durable wall surfaces, fresh and appealing aesthetics, enhanced interior design, custom storage and decorative elements, professional finish.', '2-10 weeks depending on project size', 3),
('624af629-0956-4d7c-be69-8558f5e5479a', 'Exteriors', '/images/service-exteriors.jpg', 'Comprehensive exterior construction services', 'We build and enhance the exterior of your property, ensuring durability, curb appeal, and structural integrity. Our services include new construction framing, exterior wall framing, and structural repairs. We install a variety of siding materials providing weather protection and aesthetic appeal.', '1. Site Assessment & Planning; 2. Foundation & Concrete Work; 3. Exterior Framing; 4. Sheathing & Weather Barrier Installation; 5. Siding Installation; 6. Window & Door Installation; 7. Final Exterior Finishing & Clean-up.', 'Enhanced curb appeal, increased property value, superior weather protection, structural stability, durable and low-maintenance materials, custom design options.', '4-12 weeks depending on project scope', 4),
('11aca1c2-7f43-453d-a7cd-5dabb4433064', 'Snow Control', '/images/service-snow-control.jpg', 'Prep, Salting, Plowing', 'Ensure your property remains safe and accessible throughout the winter with our comprehensive snow control services. We offer pre-season site assessments, salting to prevent ice formation, and professional plowing to clear driveways, parking lots, and walkways.', '1. Pre-season Site Assessment; 2. Monitoring Weather Forecasts; 3. Pre-treatment/Salting; 4. Snow Plowing Operations; 5. Post-Plow Salting & De-icing; 6. Follow-up & Site Inspection.', 'Enhanced safety, uninterrupted access to property, reduced liability risks, professional and timely service, peace of mind during winter.', 'Seasonal contract (October-April)', 5),
('3275831a-2334-49d3-883c-83c750839686', 'Residential Construction', '/images/service-residential.jpg', 'Building dream homes from concept to completion.', 'Our residential construction service covers everything from custom home builds to multi-unit dwellings. We work closely with clients, architects, and designers to ensure every detail aligns with their vision.', '1. Initial Consultation & Design Planning; 2. Site Preparation & Foundation Laying; 3. Framing & Structural Work; 4. Roofing & Exterior Finishing; 5. Interior Systems; 6. Interior Finishing; 7. Final Inspection & Handover.', 'Customized designs, high-quality materials, energy-efficient solutions, timely project completion, dedicated project management.', '6-18 months depending on project size and complexity', 6),
('3352477f-2461-402a-8038-8a1b55297782', 'Concrete', '/images/service-concrete.jpg', 'Precision concrete solutions for foundations, slabs, sidewalks, driveways', 'We provide professional concrete construction services for residential, commercial, and industrial projects. From structural foundations and reinforced slabs to decorative flatwork and heavy-duty surfaces, our team ensures precision grading, proper reinforcement, and expert finishing.', '1. Project Scoping & Site Evaluation; 2. Engineering Review & Permitting; 3. Excavation & Base Preparation; 4. Forming & Reinforcement Installation; 5. Concrete Pour & Finishing; 6. Curing & Quality Inspection; 7. Final Walkthrough & Approval.', 'Long-lasting structural integrity, increased property value, improved safety, clean professional finish, weather-resistant durability.', '1-6 weeks depending on scope', 7),
('83ac1998-f3f9-452c-9807-502085b3017f', 'Renovation & Remodeling', '/images/service-renovation.jpg', 'Transforming existing spaces to meet new needs and aesthetics.', 'Whether it''s a home kitchen remodel, a bathroom upgrade, or a complete commercial office overhaul, our renovation and remodeling services breathe new life into old spaces.', '1. Design Consultation & Scope Definition; 2. Demolition & Site Preparation; 3. Structural Modifications; 4. New Installations; 5. Finishing Work; 6. Final Cleaning & Inspection.', 'Increased property value, improved functionality, modern aesthetics, energy efficiency upgrades, personalized design.', '2 weeks to 6 months depending on scope', 8);

INSERT INTO public.faqs (id, question, answer, category, is_featured, display_order) VALUES
('0f52a365-2cce-4720-8b98-c6c0583d8742', 'What is the typical timeline for a new home construction project?', 'The timeline for a new home construction project can vary significantly based on size, complexity, and local regulations. Generally, it ranges from 6 to 12 months from groundbreaking to completion. This includes phases like foundation, framing, roofing, interior finishes, and final inspections.', 'Timelines', true, 1),
('870c02e8-fb0f-43ff-b7da-0704be0280a9', 'How do I get a quote for my construction project?', 'To get a detailed quote, please contact us via our website, phone, or email. We''ll schedule an initial consultation to discuss your project requirements, scope, and budget. Following this, we''ll provide a comprehensive proposal tailored to your needs.', 'Process', true, 2),
('1a1b3505-b36b-4458-9047-cae515d59f7a', 'What permits are required for a renovation project?', 'The permits required depend on the scope and location of your renovation. Common permits include building permits, electrical permits, plumbing permits, and sometimes zoning permits. We handle all necessary permit applications as part of our service to ensure compliance.', 'Policies', true, 3),
('84e16ba2-98c4-4e16-be03-92dc50721b52', 'Can I make changes to the design during construction?', 'While it''s best to finalize designs before construction begins, we understand that changes may be necessary. Any changes requested during construction will be documented as a change order, which may affect the project timeline and cost. We''ll discuss all implications with you beforehand.', 'Process', true, 4),
('12eaadad-dc7e-4afe-bbb3-8243ac032d57', 'What kind of warranty do you offer on your construction work?', 'We offer a comprehensive warranty on all our construction work, typically covering structural elements for 10 years, mechanical systems for 2 years, and finishes for 1 year. Specific warranty details will be outlined in your contract for full transparency.', 'Policies', true, 5),
('86243124-8bb1-4416-b892-1452a931128a', 'How do you ensure project quality and safety?', 'Quality and safety are our top priorities. We adhere to strict industry standards, employ experienced and certified professionals, conduct regular site inspections, and use high-quality materials. Our safety protocols comply with all local and national regulations.', 'Process', true, 6),
('f0a4c5b5-8dc3-4b72-b2c7-27263f8d45a5', 'What is the payment schedule for a typical construction project?', 'Payment schedules are typically structured in phases, with an initial deposit followed by progress payments tied to key milestones (e.g., foundation completion, framing, rough-ins, substantial completion). The final payment is due upon project completion and client satisfaction.', 'Timelines', true, 7),
('ce062fb1-f37b-4bc9-bd53-1e5d6401e021', 'Do you handle commercial as well as residential projects?', 'Yes, we have extensive experience in both residential and commercial construction projects. Our portfolio includes custom homes, multi-family dwellings, office buildings, retail spaces, and industrial facilities, demonstrating our versatility.', 'Policies', true, 8);
