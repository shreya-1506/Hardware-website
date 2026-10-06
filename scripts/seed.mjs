/**
 * Seeds categories, brands, an admin user and a demo product catalog.
 *
 *   npm run seed            # only fills tables that are still empty
 *   npm run seed -- --reset # wipes catalog data and re-seeds from scratch
 *
 * Demo products are ordinary rows — delete them from the admin panel and add
 * the real catalog; nothing here is hard-coded into the site.
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";

const ROOT = process.cwd();
const DB_PATH = process.env.DATABASE_PATH || path.join(ROOT, "data", "app.db");
const RESET = process.argv.includes("--reset");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(fs.readFileSync(path.join(ROOT, "db", "schema.sql"), "utf8"));

const art = (slug) => `/images/catalog/${slug}.svg`;

/* ------------------------------------------------------------- categories */

const CATEGORIES = [
  {
    name: "Industrial Hardware",
    slug: "industrial-hardware",
    description:
      "General industrial hardware for plant maintenance, fabrication and assembly lines — hinges, brackets, clamps, castors, channels and allied items.",
  },
  {
    name: "Machine Tools",
    slug: "machine-tools",
    description:
      "Machine tools, tool holders, chucks, vices and workholding equipment for turning, milling, drilling and grinding operations.",
  },
  {
    name: "Safety Materials",
    slug: "safety-materials",
    description:
      "Personal protective equipment and industrial safety products — helmets, hand protection, eye protection, footwear, harnesses and signage.",
  },
  {
    name: "Material Handling",
    slug: "material-handling",
    description:
      "Lifting and shifting equipment — chain pulley blocks, slings, trolleys, hydraulic pallet trucks, hooks and shackles.",
  },
  {
    name: "Adhesives",
    slug: "adhesives",
    description:
      "Industrial adhesives, sealants, thread lockers, retaining compounds and gasket makers from ANABOND and McCoy.",
  },
  {
    name: "Industrial Consumables",
    slug: "industrial-consumables",
    description:
      "Fast-moving shop-floor consumables — abrasives, cutting wheels, welding electrodes, tapes, wipes and cleaning chemicals.",
  },
  {
    name: "Fasteners",
    slug: "fasteners",
    description:
      "High-tensile bolts, nuts, washers, studs, anchors and self-drilling screws in mild steel and stainless grades.",
  },
  {
    name: "Power Tools",
    slug: "power-tools",
    description:
      "Electric and pneumatic power tools for cutting, drilling, grinding, fastening and finishing work.",
  },
  {
    name: "Hand Tools",
    slug: "hand-tools",
    description:
      "Spanners, wrenches, pliers, screwdrivers, hammers, tool kits and workshop hand tools built for daily industrial use.",
  },
  {
    name: "Cutting Tools",
    slug: "cutting-tools",
    description:
      "Drills, taps, reamers, end mills, inserts, cutting wheels and carbide tooling for production machining.",
  },
  {
    name: "Measuring Tools",
    slug: "measuring-tools",
    description:
      "Precision measuring and inspection instruments — vernier callipers, micrometers, dial gauges, gauge blocks and squares.",
  },
  {
    name: "Lubricants",
    slug: "lubricants",
    description:
      "Industrial lubricants, greases, cutting oils, rust preventives and maintenance sprays for machinery upkeep.",
  },
  {
    name: "Other Industrial Products",
    slug: "other-industrial-products",
    description:
      "Bearings, seals, pneumatics, hoses, fittings and other allied industrial supplies available on enquiry.",
  },
];

/* ----------------------------------------------------------------- brands */

const BRANDS = [
  {
    name: "ANABOND",
    slug: "anabond",
    description:
      "Indian manufacturer of engineering adhesives, silicone sealants, thread lockers and retaining compounds used across automotive and general engineering assembly.",
  },
  {
    name: "BOSS",
    slug: "boss",
    description:
      "Trusted range of hand tools, lifting tackle and material handling equipment for workshops, foundries and fabrication units.",
  },
  {
    name: "McCoy",
    slug: "mccoy",
    description:
      "Adhesives, sealants, PU foams and construction chemicals for industrial assembly, sealing and bonding applications.",
  },
  {
    name: "Golden Bullet",
    slug: "golden-bullet",
    description:
      "Abrasive cutting and grinding wheels, flap discs and depressed centre wheels engineered for fast, consistent stock removal.",
  },
];

/* --------------------------------------------------------------- products */

const P = (product) => product;

const PRODUCTS = [
  /* ------------------------------------------------------- adhesives */
  P({
    name: "ANABOND 114 Thread Locking Compound",
    sku: "AB-114-50",
    category: "adhesives",
    brand: "anabond",
    featured: true,
    short_description:
      "Medium-strength anaerobic thread locker for fasteners up to M20 that need to be serviced with hand tools.",
    description:
      "ANABOND 114 is a medium-strength, single-component anaerobic thread locking compound that cures in the absence of air between close-fitting metal threads. It locks and seals threaded assemblies against vibration loosening while still permitting disassembly with standard hand tools, making it the default choice for machine guards, motor mounts, gearbox covers and general plant maintenance.\n\nThe compound resists industrial oils, coolants, water-glycol and most workshop chemicals after full cure, and simultaneously seals the thread path against seepage. Because it fills the entire clearance between mating threads it also prevents fretting corrosion on studs that are periodically removed.",
    specifications: [
      { name: "Brand", value: "ANABOND" },
      { name: "Product Type", value: "Anaerobic Thread Locker" },
      { name: "Grade", value: "Medium Strength" },
      { name: "Colour", value: "Blue" },
      { name: "Viscosity", value: "1,200 – 1,500 cPs" },
      { name: "Thread Range", value: "Up to M20" },
      { name: "Fixture Time", value: "10 – 20 minutes" },
      { name: "Full Cure", value: "24 hours at 25 °C" },
      { name: "Temperature Range", value: "-55 °C to +150 °C" },
      { name: "Pack Size", value: "50 ml bottle" },
      { name: "Shelf Life", value: "12 months (sealed, below 25 °C)" },
    ],
    applications: [
      "Locking machine guard and cover bolts against vibration",
      "Motor, pump and gearbox mounting fasteners",
      "Adjusting screws and set screws on production machinery",
      "Sealing threaded assemblies against oil and coolant seepage",
      "Preventing fretting corrosion on periodically serviced studs",
    ],
    variants: [
      { name: "10 ml", detail: "Trial / low-volume maintenance pack" },
      { name: "50 ml", detail: "Standard workshop bottle" },
      { name: "250 ml", detail: "Production line pack" },
    ],
  }),
  P({
    name: "ANABOND 666 High Strength Retaining Compound",
    sku: "AB-666-50",
    category: "adhesives",
    brand: "anabond",
    featured: false,
    short_description:
      "High-strength anaerobic retaining compound for bonding cylindrical parts such as bearings, bushes and shafts.",
    description:
      "ANABOND 666 is a high-strength, low-viscosity anaerobic retaining compound formulated to bond cylindrical assemblies with close diametral clearance. It transmits load uniformly across the full joint area instead of concentrating it at keyways or press-fit shoulders, which raises the torque capacity of the assembly and removes the need for interference fits on lightly loaded components.\n\nTypical use is the retention of bearings on shafts, bushes in housings, gears and pulleys on drive shafts, and the salvage of worn housings where the original press fit has been lost.",
    specifications: [
      { name: "Brand", value: "ANABOND" },
      { name: "Product Type", value: "Anaerobic Retaining Compound" },
      { name: "Grade", value: "High Strength" },
      { name: "Colour", value: "Green" },
      { name: "Viscosity", value: "400 – 600 cPs" },
      { name: "Maximum Gap Fill", value: "0.15 mm" },
      { name: "Fixture Time", value: "5 – 10 minutes" },
      { name: "Shear Strength", value: "22 – 28 N/mm²" },
      { name: "Temperature Range", value: "-55 °C to +175 °C" },
      { name: "Pack Size", value: "50 ml bottle" },
    ],
    applications: [
      "Retaining ball and roller bearings on shafts",
      "Bonding bushes and liners into housings",
      "Mounting gears, pulleys and sprockets on drive shafts",
      "Salvaging worn bearing housings and shaft seats",
      "Replacing light interference fits in rotating assemblies",
    ],
    variants: [
      { name: "50 ml", detail: "Standard bottle" },
      { name: "250 ml", detail: "Production pack" },
    ],
  }),
  P({
    name: "ANABOND 1198 RTV Silicone Gasket Sealant",
    sku: "AB-1198-100",
    category: "adhesives",
    brand: "anabond",
    featured: false,
    short_description:
      "Oil-resistant RTV silicone gasket maker that cures at room temperature to a flexible, form-in-place gasket.",
    description:
      "ANABOND 1198 is a single-component RTV silicone that cures on exposure to atmospheric moisture to form a tough, flexible, form-in-place gasket. It is used wherever a machined flange must be sealed against oil, water or low-pressure gas and where a pre-cut gasket would be slow to source or difficult to fit.\n\nThe cured bead accommodates flange movement and thermal cycling without cracking, and remains serviceable across a wide temperature band, which makes it suitable for gearbox covers, oil sumps, pump housings and inspection plates.",
    specifications: [
      { name: "Brand", value: "ANABOND" },
      { name: "Product Type", value: "RTV Silicone Gasket Sealant" },
      { name: "Cure System", value: "Moisture cure (single component)" },
      { name: "Colour", value: "Grey" },
      { name: "Tack-Free Time", value: "15 – 25 minutes" },
      { name: "Cure Rate", value: "2 – 3 mm per 24 hours" },
      { name: "Elongation at Break", value: "≥ 350 %" },
      { name: "Temperature Range", value: "-50 °C to +250 °C" },
      { name: "Pack Size", value: "100 g tube" },
    ],
    applications: [
      "Form-in-place gaskets on gearbox and sump covers",
      "Sealing pump and compressor housings",
      "Inspection plates and access covers",
      "Sealing flanges where pre-cut gaskets are unavailable",
      "Thread and flange sealing on low-pressure oil lines",
    ],
    variants: [
      { name: "100 g tube", detail: "Maintenance pack" },
      { name: "300 ml cartridge", detail: "Gun-applied production pack" },
    ],
  }),
  P({
    name: "McCoy Industrial Adhesive",
    sku: "MC-IA-500",
    category: "adhesives",
    brand: "mccoy",
    featured: true,
    short_description:
      "General-purpose high-tack industrial adhesive for bonding laminates, rubber, leather, felt and metal surfaces.",
    description:
      "McCoy Industrial Adhesive is a high-tack, solvent-based contact adhesive for fast bonding of dissimilar materials on the shop floor. It develops grab immediately on contact and reaches handling strength within minutes, which suits trim work, gasket fabrication, insulation lagging and general maintenance repairs where clamping is impractical.\n\nThe adhesive film stays flexible after cure so it tolerates vibration and slight substrate movement, and it resists water, mild acids and lubricating oils once fully set.",
    specifications: [
      { name: "Brand", value: "McCoy" },
      { name: "Product Type", value: "Contact / Industrial Adhesive" },
      { name: "Base", value: "Synthetic rubber (solvent based)" },
      { name: "Appearance", value: "Amber viscous liquid" },
      { name: "Coverage", value: "3 – 4 m² per litre (both surfaces)" },
      { name: "Open Time", value: "10 – 15 minutes" },
      { name: "Handling Strength", value: "20 minutes" },
      { name: "Service Temperature", value: "-20 °C to +90 °C" },
      { name: "Pack Size", value: "500 ml tin" },
    ],
    applications: [
      "Bonding rubber sheets, gaskets and beading",
      "Fixing laminates and insulation lagging",
      "Leather, felt and fabric bonding in trim shops",
      "Metal-to-rubber conveyor belt repairs",
      "General workshop and maintenance repairs",
    ],
    variants: [
      { name: "100 ml", detail: "Tube pack" },
      { name: "500 ml", detail: "Workshop tin" },
      { name: "5 litre", detail: "Bulk tin" },
    ],
  }),
  P({
    name: "McCoy PU Construction Foam Sealant 750 ml",
    sku: "MC-PU-750",
    category: "adhesives",
    brand: "mccoy",
    featured: false,
    short_description:
      "Gun-grade polyurethane expanding foam for filling, sealing and insulating gaps around frames and service penetrations.",
    description:
      "McCoy PU Construction Foam is a single-component, moisture-curing polyurethane foam supplied in a gun-grade canister. It expands on application to fill irregular voids and cures to a closed-cell structure that insulates thermally and acoustically while sealing against draughts and dust.\n\nOn plant sites it is used for sealing cable and pipe penetrations through walls, packing out door and window frames, and filling voids around ducting where a rigid, trimmable seal is required.",
    specifications: [
      { name: "Brand", value: "McCoy" },
      { name: "Product Type", value: "Gun-Grade PU Expanding Foam" },
      { name: "Yield", value: "Up to 45 litres free expansion" },
      { name: "Tack-Free Time", value: "8 – 10 minutes" },
      { name: "Cutting Time", value: "25 – 35 minutes" },
      { name: "Cell Structure", value: "Closed cell, > 70 %" },
      { name: "Fire Class", value: "B3 (DIN 4102)" },
      { name: "Application Temperature", value: "+5 °C to +35 °C" },
      { name: "Pack Size", value: "750 ml canister" },
    ],
    applications: [
      "Sealing cable and pipe penetrations through walls",
      "Packing out door, window and louvre frames",
      "Filling voids around ducting and service runs",
      "Thermal and acoustic insulation of cavities",
      "Fixing and sealing insulation boards",
    ],
    variants: [
      { name: "500 ml", detail: "Hand-held straw type" },
      { name: "750 ml", detail: "Gun-grade canister" },
    ],
  }),

  /* ----------------------------------------------- cutting / consumables */
  P({
    name: "Golden Bullet Cut-Off Wheel 4 inch",
    sku: "GB-CW-105",
    category: "cutting-tools",
    brand: "golden-bullet",
    featured: true,
    short_description:
      "105 mm reinforced abrasive cut-off wheel for fast, burr-free cutting of mild steel, stainless and section material.",
    description:
      "The Golden Bullet 4 inch cut-off wheel is a double fibreglass reinforced, resin-bonded abrasive wheel designed for angle grinders running at up to 15,200 rpm. The aluminium oxide grain and hard bond combination gives a fast cut with minimal burring and low burn-through on thin sheet and light sections.\n\nDouble reinforcement holds the wheel together under side load, which is the usual failure mode in fabrication work, and the thin 1.0 mm profile reduces material loss and the effort needed per cut.",
    specifications: [
      { name: "Brand", value: "Golden Bullet" },
      { name: "Product Type", value: "Reinforced Cut-Off Wheel" },
      { name: "Diameter", value: "105 mm (4 inch)" },
      { name: "Thickness", value: "1.0 mm" },
      { name: "Bore", value: "16 mm" },
      { name: "Abrasive Grain", value: "Aluminium Oxide (A)" },
      { name: "Bond", value: "Resinoid, double fibreglass reinforced" },
      { name: "Maximum Speed", value: "15,200 rpm / 80 m/s" },
      { name: "Suitable For", value: "Mild steel, stainless steel, sections" },
      { name: "Pack", value: "Box of 50 wheels" },
    ],
    applications: [
      "Cutting mild steel angle, flat and tube",
      "Trimming stainless steel sheet and pipe",
      "Removing welds, runners and risers",
      "Cutting reinforcement bar and threaded rod",
      "General fabrication and site cutting work",
    ],
    variants: [
      { name: '4" x 1.0 mm', detail: "105 mm, thin cut" },
      { name: '7" x 1.6 mm', detail: "180 mm, general purpose" },
      { name: '14" x 3.0 mm', detail: "355 mm, chop saw" },
    ],
  }),
  P({
    name: "Golden Bullet Depressed Centre Grinding Wheel 100 mm",
    sku: "GB-DC-100",
    category: "industrial-consumables",
    brand: "golden-bullet",
    featured: false,
    short_description:
      "6 mm depressed centre grinding wheel for weld dressing, chamfering and heavy stock removal on steel.",
    description:
      "A resin-bonded, fibreglass reinforced depressed centre wheel for stock removal and weld dressing on carbon and low-alloy steel. The offset hub gives clearance for the grinder guard and lets the operator work comfortably at a 20–30° attack angle.\n\nThe wheel is formulated for a controlled break-down rate so it exposes fresh grain steadily rather than glazing, which keeps cutting rates high through the life of the wheel.",
    specifications: [
      { name: "Brand", value: "Golden Bullet" },
      { name: "Product Type", value: "Depressed Centre Grinding Wheel" },
      { name: "Diameter", value: "100 mm" },
      { name: "Thickness", value: "6.0 mm" },
      { name: "Bore", value: "16 mm" },
      { name: "Grain", value: "Aluminium Oxide" },
      { name: "Maximum Speed", value: "15,200 rpm" },
      { name: "Standard", value: "EN 12413 compliant" },
      { name: "Pack", value: "Box of 25 wheels" },
    ],
    applications: [
      "Weld bead dressing and blending",
      "Chamfering and edge preparation before welding",
      "Removing scale, rust and surface defects",
      "Fettling castings and forgings",
      "Heavy stock removal on structural steel",
    ],
    variants: [
      { name: "100 x 6 x 16 mm", detail: "4 inch grinder" },
      { name: "180 x 6 x 22 mm", detail: "7 inch grinder" },
    ],
  }),
  P({
    name: "Golden Bullet Zirconia Flap Disc 100 mm",
    sku: "GB-FD-100Z",
    category: "industrial-consumables",
    brand: "golden-bullet",
    featured: false,
    short_description:
      "Zirconia alumina flap disc that grinds and finishes in a single pass on steel and stainless steel.",
    description:
      "Zirconia alumina flap discs combine the stock removal of a grinding wheel with the finish of a sanding disc. The overlapping cloth flaps present fresh grain continuously as they wear, giving a consistent cut rate and a cooler action than a bonded wheel — important on stainless steel where heat tint and distortion are a concern.\n\nThe fibreglass backing plate is trimmable and safe to grind down with the disc, so the full abrasive area can be used.",
    specifications: [
      { name: "Brand", value: "Golden Bullet" },
      { name: "Product Type", value: "Zirconia Flap Disc" },
      { name: "Diameter", value: "100 mm" },
      { name: "Bore", value: "16 mm" },
      { name: "Grit", value: "P60 (P40 / P80 / P120 also available)" },
      { name: "Abrasive", value: "Zirconia Alumina" },
      { name: "Backing", value: "Fibreglass, conical Type 29" },
      { name: "Maximum Speed", value: "15,200 rpm" },
      { name: "Pack", value: "Box of 10 discs" },
    ],
    applications: [
      "Weld blending on stainless steel fabrications",
      "Deburring and edge breaking",
      "Surface preparation before painting or coating",
      "Rust and mill-scale removal",
      "Single-pass grind and finish on carbon steel",
    ],
    variants: [
      { name: "P40", detail: "Heavy stock removal" },
      { name: "P60", detail: "General purpose" },
      { name: "P80", detail: "Blending" },
      { name: "P120", detail: "Finishing" },
    ],
  }),
  P({
    name: "HSS Parallel Shank Twist Drill Set — 1 to 13 mm",
    sku: "CT-HSS-13SET",
    category: "cutting-tools",
    brand: null,
    featured: true,
    short_description:
      "25-piece ground HSS jobber drill set in 0.5 mm steps, supplied in a steel index case.",
    description:
      "A fully ground high speed steel jobber drill set covering 1.0 mm to 13.0 mm in 0.5 mm increments. The 118° point and 30° helix suit general purpose drilling in mild steel, cast iron, brass, aluminium and plastics on both bench and radial drilling machines.\n\nDrills are held in a hinged steel index case with a size chart, which keeps the set complete and lets the operator identify sizes quickly at the machine.",
    specifications: [
      { name: "Product Type", value: "Jobber Twist Drill Set" },
      { name: "Material", value: "High Speed Steel (HSS M2)" },
      { name: "Finish", value: "Bright, fully ground" },
      { name: "Size Range", value: "1.0 – 13.0 mm in 0.5 mm steps" },
      { name: "Pieces", value: "25" },
      { name: "Point Angle", value: "118°" },
      { name: "Shank", value: "Parallel (straight)" },
      { name: "Standard", value: "DIN 338" },
      { name: "Packing", value: "Hinged steel index case" },
    ],
    applications: [
      "General purpose drilling in mild steel and cast iron",
      "Maintenance and fitting work",
      "Drilling brass, aluminium and plastics",
      "Pilot holes prior to tapping",
      "Toolroom and fabrication shop use",
    ],
    variants: [
      { name: "13 pc (1–13 mm, 1 mm steps)", detail: "Economy set" },
      { name: "25 pc (1–13 mm, 0.5 mm steps)", detail: "Standard set" },
    ],
  }),
  P({
    name: "HSS Hand Tap Set M3 – M12",
    sku: "CT-TAP-M312",
    category: "cutting-tools",
    brand: null,
    featured: false,
    short_description:
      "Ground HSS hand tap set with taper, second and plug taps for metric coarse threads M3 to M12.",
    description:
      "A ground high speed steel hand tap set covering metric coarse threads from M3 to M12. Each size is supplied as a three-piece sequence — taper, second and plug — so through and blind holes can both be threaded to full depth.\n\nThe taps are suited to hand tapping in mild steel, cast iron, brass and aluminium, and the square drive ends fit standard tap wrenches.",
    specifications: [
      { name: "Product Type", value: "Hand Tap Set (Taper / Second / Plug)" },
      { name: "Material", value: "High Speed Steel, ground thread" },
      { name: "Thread Range", value: "M3, M4, M5, M6, M8, M10, M12" },
      { name: "Thread Form", value: "Metric coarse (ISO 68-1)" },
      { name: "Tolerance Class", value: "ISO2 (6H)" },
      { name: "Pieces", value: "21 (3 per size)" },
      { name: "Packing", value: "Moulded plastic case" },
    ],
    applications: [
      "Hand tapping threads in mild steel and cast iron",
      "Cleaning and re-cutting damaged threads",
      "Blind hole tapping with plug taps",
      "Maintenance and fitting work",
      "Toolroom and assembly use",
    ],
    variants: [
      { name: "M3 – M12", detail: "21 piece set" },
      { name: "Individual sizes", detail: "Available loose on request" },
    ],
  }),
  P({
    name: "Carbide Tipped TCT Hole Saw 32 mm",
    sku: "CT-TCT-32",
    category: "cutting-tools",
    brand: null,
    featured: false,
    short_description:
      "Tungsten carbide tipped hole saw for clean cut-outs in sheet metal, stainless steel and panels.",
    description:
      "A tungsten carbide tipped hole saw for producing clean, round cut-outs in sheet metal, panels and enclosures. The brazed carbide teeth hold an edge far longer than bi-metal in stainless steel and galvanised sheet, and the deep gullet clears swarf so the cut stays cool.\n\nSupplied with an arbor and pilot drill and suitable for use in a hand drill, magnetic base drill or bench drilling machine.",
    specifications: [
      { name: "Product Type", value: "TCT Hole Saw" },
      { name: "Cutting Diameter", value: "32 mm" },
      { name: "Cutting Depth", value: "25 mm" },
      { name: "Tooth Material", value: "Tungsten Carbide (brazed tips)" },
      { name: "Arbor", value: "Hex shank with HSS pilot drill" },
      { name: "Suitable For", value: "MS / SS sheet, panels, plastics, wood" },
      { name: "Maximum Sheet Thickness", value: "6 mm (mild steel)" },
    ],
    applications: [
      "Cable gland cut-outs in control panels",
      "Cutting holes in stainless steel enclosures",
      "Conduit and pipe entry holes",
      "Instrument mounting cut-outs",
      "Sheet metal fabrication work",
    ],
    variants: [
      { name: "20 mm", detail: "Cable gland size" },
      { name: "32 mm", detail: "Standard" },
      { name: "50 mm", detail: "Large penetration" },
    ],
  }),

  /* --------------------------------------------------------- hand tools */
  P({
    name: "BOSS Double Ended Spanner Set — 8 Piece",
    sku: "BS-DE-8",
    category: "hand-tools",
    brand: "boss",
    featured: true,
    short_description:
      "Drop-forged chrome vanadium double ended spanner set covering 6 mm to 22 mm across flats.",
    description:
      "A drop-forged chrome vanadium steel double open ended spanner set, hardened, tempered and chrome plated for corrosion resistance. Jaw faces are machined to close tolerance so the spanner seats squarely on the fastener and does not round off corners under load.\n\nThe eight-piece range covers the fastener sizes most common in Indian plant maintenance, from M4 through M14, and the set is supplied in a roll-up pouch for tool crib control.",
    specifications: [
      { name: "Brand", value: "BOSS" },
      { name: "Product Type", value: "Double Open Ended Spanner Set" },
      { name: "Material", value: "Chrome Vanadium Steel, drop forged" },
      { name: "Hardness", value: "44 – 48 HRC" },
      { name: "Finish", value: "Chrome plated" },
      { name: "Sizes", value: "6x7, 8x9, 10x11, 12x13, 14x15, 16x17, 18x19, 20x22 mm" },
      { name: "Pieces", value: "8" },
      { name: "Standard", value: "IS 2028 / DIN 3110" },
      { name: "Packing", value: "Roll-up canvas pouch" },
    ],
    applications: [
      "Plant and machinery maintenance",
      "Assembly line fastening work",
      "Automobile and workshop servicing",
      "Fitter and millwright tool kits",
      "Site erection and commissioning",
    ],
    variants: [
      { name: "8 piece (6 – 22 mm)", detail: "Standard set" },
      { name: "12 piece (6 – 32 mm)", detail: "Extended set" },
    ],
  }),
  P({
    name: "BOSS Combination Plier 8 inch Insulated",
    sku: "BS-CP-200",
    category: "hand-tools",
    brand: "boss",
    featured: false,
    short_description:
      "200 mm forged combination plier with induction-hardened cutting edges and 1000 V insulated grips.",
    description:
      "A 200 mm drop-forged combination plier with serrated gripping jaws, a pipe grip section and side cutters with induction-hardened edges. The dual-layer insulated sleeves are tested to 1000 V AC, making the tool suitable for electrical maintenance as well as general fitting work.\n\nThe joint is machined and riveted for smooth action without side play, and the cutting edges will shear soft steel wire and copper conductor cleanly.",
    specifications: [
      { name: "Brand", value: "BOSS" },
      { name: "Product Type", value: "Combination Plier (Insulated)" },
      { name: "Length", value: "200 mm (8 inch)" },
      { name: "Material", value: "Drop forged carbon steel" },
      { name: "Cutting Edge Hardness", value: "58 – 62 HRC (induction hardened)" },
      { name: "Insulation", value: "Dual layer, tested to 1000 V AC" },
      { name: "Cutting Capacity", value: "Soft wire 3.0 mm / hard wire 2.0 mm" },
      { name: "Standard", value: "IS 3650 / IEC 60900" },
    ],
    applications: [
      "Electrical panel and wiring maintenance",
      "Gripping, twisting and cutting wire",
      "General fitting and assembly work",
      "Maintenance electrician tool kits",
      "Site installation work",
    ],
    variants: [
      { name: "6 inch (150 mm)", detail: "Light duty" },
      { name: "8 inch (200 mm)", detail: "Standard" },
    ],
  }),
  P({
    name: "BOSS Socket Wrench Set 1/2 inch Drive — 24 Piece",
    sku: "BS-SW-24",
    category: "hand-tools",
    brand: "boss",
    featured: false,
    short_description:
      "Chrome vanadium 1/2 inch drive socket set with ratchet, extensions and universal joint in a blow-moulded case.",
    description:
      "A 24-piece 1/2 inch square drive socket set in chrome vanadium steel with a 72-tooth reversible ratchet handle. Sockets are bi-hexagonal internally so they engage the flanks of the fastener rather than the corners, which greatly reduces rounding on tight or corroded nuts.\n\nThe set includes extension bars, a sliding T-bar, a universal joint and spark plug sockets, covering most bolt-up and dismantling work in a maintenance department.",
    specifications: [
      { name: "Brand", value: "BOSS" },
      { name: "Product Type", value: "Socket Wrench Set" },
      { name: "Drive Size", value: '1/2" square drive' },
      { name: "Material", value: "Chrome Vanadium Steel" },
      { name: "Socket Range", value: "10 – 32 mm" },
      { name: "Ratchet", value: "72 tooth, reversible" },
      { name: "Accessories", value: "125 mm & 250 mm extensions, T-bar, universal joint" },
      { name: "Pieces", value: "24" },
      { name: "Packing", value: "Blow-moulded case" },
    ],
    applications: [
      "Machinery dismantling and reassembly",
      "Bolt-up work on flanges and foundations",
      "Automobile and heavy vehicle servicing",
      "Maintenance and breakdown attendance",
      "Erection and commissioning teams",
    ],
    variants: [
      { name: '1/2" drive, 24 pc', detail: "Standard maintenance set" },
      { name: '1/4" drive, 40 pc', detail: "Light / instrumentation set" },
    ],
  }),
  P({
    name: "Heavy Duty Bench Vice 6 inch Swivel Base",
    sku: "HT-BV-150",
    category: "hand-tools",
    brand: null,
    featured: false,
    short_description:
      "150 mm cast iron bench vice with hardened serrated jaws, pipe grip and 360° lockable swivel base.",
    description:
      "A 150 mm jaw bench vice cast in high grade grey iron with a precision-machined slideway and an acme screw for smooth, high-clamping action. The replaceable serrated jaw plates are hardened for grip and the integral pipe jaws hold round stock without crushing.\n\nThe swivel base rotates through 360° and locks on two bolts, letting the operator present work at a comfortable angle — useful in fitting shops and maintenance bays where the vice serves many jobs.",
    specifications: [
      { name: "Product Type", value: "Bench Vice, Swivel Base" },
      { name: "Jaw Width", value: "150 mm (6 inch)" },
      { name: "Jaw Opening", value: "160 mm" },
      { name: "Throat Depth", value: "80 mm" },
      { name: "Body Material", value: "Grey Cast Iron FG 200" },
      { name: "Jaw Plates", value: "Hardened, serrated, replaceable" },
      { name: "Spindle", value: "Acme thread, machined" },
      { name: "Base", value: "360° swivel, twin bolt lock" },
      { name: "Approximate Weight", value: "18 kg" },
    ],
    applications: [
      "Fitting shop and toolroom work holding",
      "Filing, sawing, chiselling and tapping",
      "Pipe holding and threading",
      "Assembly and repair benches",
      "Maintenance workshops",
    ],
    variants: [
      { name: '4" (100 mm)', detail: "Light duty" },
      { name: '6" (150 mm)', detail: "Standard workshop" },
      { name: '8" (200 mm)', detail: "Heavy duty" },
    ],
  }),

  /* -------------------------------------------------------- power tools */
  P({
    name: "Angle Grinder 4 inch 850 W",
    sku: "PT-AG-100",
    category: "power-tools",
    brand: null,
    featured: true,
    short_description:
      "850 W 100 mm angle grinder with 11,000 rpm spindle speed, side handle and spindle lock.",
    description:
      "A compact 100 mm angle grinder rated 850 W, intended for continuous shop-floor cutting, grinding and weld dressing. The field and armature are copper wound and the housing is vented for sustained duty, while the labyrinth-sealed gearbox keeps grinding dust out of the bearings.\n\nA spindle lock button makes wheel changes quick, and the two-position side handle plus an adjustable guard let the tool be set up for either right or left-hand work.",
    specifications: [
      { name: "Product Type", value: "Angle Grinder" },
      { name: "Wheel Diameter", value: "100 mm (4 inch)" },
      { name: "Input Power", value: "850 W" },
      { name: "No Load Speed", value: "11,000 rpm" },
      { name: "Spindle Thread", value: "M10" },
      { name: "Supply", value: "230 V, 50 Hz, single phase" },
      { name: "Weight", value: "1.9 kg" },
      { name: "Insulation", value: "Double insulated, Class II" },
      { name: "Supplied With", value: "Guard, side handle, spanner" },
    ],
    applications: [
      "Cutting steel sections, tube and rod",
      "Weld dressing and chamfering",
      "Rust and paint removal with wire cup brush",
      "Deburring and finishing with flap discs",
      "Fabrication and site work",
    ],
    variants: [
      { name: '4" / 850 W', detail: "Standard" },
      { name: '5" / 1200 W', detail: "Heavy duty" },
      { name: '7" / 2200 W', detail: "Large fabrication" },
    ],
  }),
  P({
    name: "Impact Drill 13 mm 750 W Reversible",
    sku: "PT-ID-13",
    category: "power-tools",
    brand: null,
    featured: false,
    short_description:
      "750 W reversible impact drill with variable speed, 13 mm keyed chuck and hammer/rotary selector.",
    description:
      "A 750 W two-mode impact drill with a 13 mm keyed chuck, electronic variable speed and forward/reverse operation. In rotary mode it drills steel and wood; switching in the hammer action allows drilling into brick, block and concrete without a dedicated rotary hammer.\n\nThe variable speed trigger with a lock-on button and the depth stop rod make it practical for repetitive anchor-hole drilling during plant installation work.",
    specifications: [
      { name: "Product Type", value: "Impact Drill (Percussion)" },
      { name: "Input Power", value: "750 W" },
      { name: "Chuck Capacity", value: "13 mm keyed" },
      { name: "No Load Speed", value: "0 – 2,800 rpm variable" },
      { name: "Impact Rate", value: "0 – 44,800 bpm" },
      { name: "Drilling Capacity", value: "Steel 13 mm / Concrete 16 mm / Wood 30 mm" },
      { name: "Supply", value: "230 V, 50 Hz" },
      { name: "Features", value: "Reversible, lock-on switch, depth stop" },
      { name: "Weight", value: "2.4 kg" },
    ],
    applications: [
      "Drilling anchor holes in concrete and masonry",
      "Drilling steel plate and sections",
      "Driving screws and fasteners in reverse mode",
      "Plant installation and erection work",
      "General maintenance drilling",
    ],
    variants: [
      { name: "10 mm / 550 W", detail: "Light duty" },
      { name: "13 mm / 750 W", detail: "Standard" },
    ],
  }),

  /* ------------------------------------------------------ machine tools */
  P({
    name: "Self Centring Lathe Chuck 3 Jaw 200 mm",
    sku: "MT-LC-200",
    category: "machine-tools",
    brand: null,
    featured: true,
    short_description:
      "200 mm three jaw self centring scroll chuck with hardened jaws, supplied with internal and external jaw sets.",
    description:
      "A 200 mm three jaw self centring lathe chuck with a hardened and ground scroll plate for repeatable concentricity on round and hexagonal work. The body is heat-treated alloy steel, ground on the mounting face and outside diameter so it registers true on the spindle nose.\n\nBoth internal and external jaw sets are supplied, and the jaws are individually numbered and hardened to resist deformation from repeated heavy clamping.",
    specifications: [
      { name: "Product Type", value: "3 Jaw Self Centring Lathe Chuck" },
      { name: "Nominal Diameter", value: "200 mm (8 inch)" },
      { name: "Through Hole", value: "55 mm" },
      { name: "Body Material", value: "Alloy steel, hardened and ground" },
      { name: "Run-Out Accuracy", value: "0.05 mm (at chuck face)" },
      { name: "Maximum Speed", value: "2,500 rpm" },
      { name: "Clamping Range (External)", value: "3 – 200 mm" },
      { name: "Supplied With", value: "Internal + external jaw sets, chuck key" },
      { name: "Mounting", value: "Direct mount / back plate" },
    ],
    applications: [
      "Turning round and hexagonal bar stock",
      "Second-operation machining on centre lathes",
      "Facing, boring and threading operations",
      "Toolroom and production turning",
      "Retrofitting older lathes",
    ],
    variants: [
      { name: "160 mm (6 inch)", detail: "Light lathes" },
      { name: "200 mm (8 inch)", detail: "Standard" },
      { name: "250 mm (10 inch)", detail: "Heavy lathes" },
    ],
  }),
  P({
    name: "Precision Machine Vice 100 mm Milling",
    sku: "MT-MV-100",
    category: "machine-tools",
    brand: null,
    featured: false,
    short_description:
      "100 mm hardened and ground milling machine vice with 0.02 mm parallelism and swivel base option.",
    description:
      "A precision milling vice with hardened and ground jaw faces, base and slideway, held to 0.02 mm parallelism and squareness so that work clamped in it can be machined to tolerance without additional indicating.\n\nThe pull-down jaw design draws the moving jaw downward as it clamps, seating the workpiece firmly on the vice bed and eliminating the lift that causes taper on milled faces.",
    specifications: [
      { name: "Product Type", value: "Precision Milling Machine Vice" },
      { name: "Jaw Width", value: "100 mm" },
      { name: "Jaw Opening", value: "125 mm" },
      { name: "Jaw Depth", value: "40 mm" },
      { name: "Parallelism", value: "0.02 mm" },
      { name: "Squareness", value: "0.02 mm" },
      { name: "Jaw Hardness", value: "58 – 62 HRC, ground" },
      { name: "Body", value: "Ductile iron, stress relieved" },
      { name: "Weight", value: "26 kg" },
    ],
    applications: [
      "Workholding on vertical and horizontal milling machines",
      "Drilling and tapping on radial drills",
      "Slotting and keyway cutting",
      "Toolroom and jig boring work",
      "Inspection and marking-out setups",
    ],
    variants: [
      { name: "75 mm", detail: "Light duty" },
      { name: "100 mm", detail: "Standard" },
      { name: "150 mm", detail: "Heavy duty" },
    ],
  }),
  P({
    name: "BT40 ER32 Collet Chuck Tool Holder",
    sku: "MT-BT40-ER32",
    category: "machine-tools",
    brand: null,
    featured: false,
    short_description:
      "Balanced BT40 taper ER32 collet chuck holder with 0.005 mm run-out for CNC milling and drilling.",
    description:
      "A BT40 taper ER32 collet chuck holder machined from through-hardened alloy steel and dynamically balanced for use at production spindle speeds. Run-out is held within 0.005 mm at 3× diameter, which protects tool life and surface finish when running carbide end mills and drills.\n\nThe ER32 collet range accepts shank diameters from 2 mm to 20 mm, letting one holder cover most of the tooling in a typical VMC magazine.",
    specifications: [
      { name: "Product Type", value: "Collet Chuck Tool Holder" },
      { name: "Taper", value: "BT40 (MAS 403 BT)" },
      { name: "Collet System", value: "ER32" },
      { name: "Clamping Range", value: "2 – 20 mm (with collet set)" },
      { name: "Run-Out", value: "≤ 0.005 mm at 3D" },
      { name: "Gauge Length", value: "70 mm" },
      { name: "Balance Grade", value: "G2.5 at 20,000 rpm" },
      { name: "Material", value: "Alloy steel, hardened 58 HRC" },
    ],
    applications: [
      "Holding carbide and HSS end mills on VMCs",
      "Precision drilling and reaming",
      "Tapping with tension-compression collets",
      "Small-diameter high-speed milling",
      "General CNC machining centre tooling",
    ],
    variants: [
      { name: "BT40 ER32", detail: "General purpose" },
      { name: "BT40 ER25", detail: "Small tooling" },
      { name: "BT30 ER20", detail: "Compact spindles" },
    ],
  }),

  /* --------------------------------------------------- measuring tools */
  P({
    name: "Digital Vernier Calliper 0 – 150 mm",
    sku: "MS-DVC-150",
    category: "measuring-tools",
    brand: null,
    featured: true,
    short_description:
      "Stainless steel digital calliper with 0.01 mm resolution, IP54 protection and mm/inch conversion.",
    description:
      "A hardened stainless steel digital calliper reading to 0.01 mm with a large LCD, zero-set at any position and instant mm/inch conversion. The measuring faces are lapped and the beam is hardened throughout so the instrument holds accuracy in shop-floor use.\n\nIP54 sealing keeps coolant mist and swarf out of the electronics, making it suitable for in-process inspection beside the machine rather than only in the inspection room. Supplied in a fitted case with a calibration certificate.",
    specifications: [
      { name: "Product Type", value: "Digital Vernier Calliper" },
      { name: "Measuring Range", value: "0 – 150 mm / 0 – 6 inch" },
      { name: "Resolution", value: "0.01 mm / 0.0005 inch" },
      { name: "Accuracy", value: "± 0.02 mm" },
      { name: "Repeatability", value: "0.01 mm" },
      { name: "Material", value: "Hardened stainless steel" },
      { name: "Protection", value: "IP54 (coolant proof)" },
      { name: "Measurements", value: "External, internal, depth, step" },
      { name: "Power", value: "SR44 / LR44 button cell" },
      { name: "Supplied With", value: "Fitted case, calibration certificate" },
    ],
    applications: [
      "In-process dimensional inspection at the machine",
      "Incoming material and component checking",
      "Toolroom and maintenance measurement",
      "Quality control and first-article inspection",
      "Reverse engineering and marking out",
    ],
    variants: [
      { name: "0 – 150 mm", detail: "Standard" },
      { name: "0 – 200 mm", detail: "Extended" },
      { name: "0 – 300 mm", detail: "Large components" },
    ],
  }),
  P({
    name: "Outside Micrometer 0 – 25 mm",
    sku: "MS-OM-25",
    category: "measuring-tools",
    brand: null,
    featured: false,
    short_description:
      "0 – 25 mm outside micrometer with carbide measuring faces, ratchet stop and 0.01 mm graduation.",
    description:
      "A 0 – 25 mm outside micrometer with carbide-tipped anvil and spindle faces, lapped flat and parallel for accurate contact. The ratchet stop applies consistent measuring force so readings do not vary between operators, and the spindle lock holds the setting while the part is removed.\n\nThe frame is drop-forged steel with heat-insulating pads to reduce hand-heat drift, and a setting standard and spanner are supplied for zeroing.",
    specifications: [
      { name: "Product Type", value: "Outside Micrometer" },
      { name: "Measuring Range", value: "0 – 25 mm" },
      { name: "Graduation", value: "0.01 mm" },
      { name: "Accuracy", value: "± 0.004 mm" },
      { name: "Measuring Faces", value: "Tungsten carbide, lapped" },
      { name: "Spindle Thread", value: "Ground, hardened" },
      { name: "Frame", value: "Drop forged steel with heat pads" },
      { name: "Features", value: "Ratchet stop, spindle lock" },
      { name: "Supplied With", value: "Setting standard, spanner, case" },
    ],
    applications: [
      "Precision diameter measurement of turned parts",
      "Sheet, plate and wire thickness checking",
      "Gauge and tool inspection",
      "Machine setting and offset verification",
      "Quality control laboratories",
    ],
    variants: [
      { name: "0 – 25 mm", detail: "Standard" },
      { name: "25 – 50 mm", detail: "Second range" },
      { name: "50 – 75 mm", detail: "Third range" },
    ],
  }),
  P({
    name: "Lever Type Dial Test Indicator 0.8 mm",
    sku: "MS-DTI-08",
    category: "measuring-tools",
    brand: null,
    featured: false,
    short_description:
      "0.8 mm range lever type dial test indicator reading 0.01 mm, for machine setting and run-out checks.",
    description:
      "A lever type dial test indicator with 0.8 mm range and 0.01 mm graduation, used for centring work in four-jaw chucks, checking shaft and spindle run-out, and tramming milling heads. The reversible contact point and swivelling dial let the instrument be read from awkward positions.\n\nJewelled bearings give a light, consistent action and the carbide contact point resists wear from repeated setting work.",
    specifications: [
      { name: "Product Type", value: "Lever Type Dial Test Indicator" },
      { name: "Measuring Range", value: "0.8 mm" },
      { name: "Graduation", value: "0.01 mm" },
      { name: "Dial Reading", value: "0 – 40 – 0" },
      { name: "Accuracy", value: "± 0.01 mm" },
      { name: "Contact Point", value: "Carbide tipped, reversible" },
      { name: "Bearings", value: "Jewelled" },
      { name: "Stem Diameter", value: "8 mm / 4 mm dovetail" },
      { name: "Supplied With", value: "Holder, case" },
    ],
    applications: [
      "Centring work in four-jaw chucks",
      "Shaft and spindle run-out measurement",
      "Tramming milling machine heads",
      "Checking parallelism and flatness of setups",
      "Machine tool alignment and geometry checks",
    ],
    variants: [
      { name: "0.8 mm range", detail: "Standard" },
      { name: "0.2 mm range", detail: "Fine resolution" },
    ],
  }),

  /* --------------------------------------------------- safety materials */
  P({
    name: "Industrial Safety Helmet with Ratchet Harness",
    sku: "SF-HL-RT",
    category: "safety-materials",
    brand: null,
    featured: true,
    short_description:
      "HDPE industrial safety helmet with 6-point cradle, ratchet adjustment and chin strap, IS 2925 marked.",
    description:
      "An injection-moulded HDPE safety helmet with a six-point textile cradle and ratchet size adjustment, giving a secure fit that can be changed with one hand while wearing gloves. The shell is UV-stabilised and dielectric, and the ribbed crown improves impact energy absorption.\n\nVentilation slots with an internal baffle keep the helmet comfortable in Indian summer conditions, and universal accessory slots accept ear muffs and visors for combined protection.",
    specifications: [
      { name: "Product Type", value: "Industrial Safety Helmet" },
      { name: "Shell Material", value: "HDPE, UV stabilised" },
      { name: "Harness", value: "6-point textile cradle" },
      { name: "Adjustment", value: "Ratchet, 52 – 64 cm" },
      { name: "Standard", value: "IS 2925 / EN 397" },
      { name: "Electrical", value: "Dielectric up to 440 V AC" },
      { name: "Weight", value: "340 g" },
      { name: "Accessory Slots", value: "Universal (ear muffs, visor)" },
      { name: "Colours", value: "White, yellow, blue, red, green" },
    ],
    applications: [
      "Mandatory head protection on plant shop floors",
      "Construction and erection sites",
      "Foundries, forging and fabrication shops",
      "Warehouse and material handling areas",
      "Visitor and contractor safety issue",
    ],
    variants: [
      { name: "Ratchet type", detail: "Tool-free adjustment" },
      { name: "Pin-lock type", detail: "Economy option" },
      { name: "With chin strap", detail: "Working at height" },
    ],
  }),
  P({
    name: "Cut Resistant Level 5 Safety Gloves",
    sku: "SF-GL-CR5",
    category: "safety-materials",
    brand: null,
    featured: false,
    short_description:
      "HPPE knitted gloves with PU palm coating offering EN 388 Level 5 cut resistance and full dexterity.",
    description:
      "Seamless 13-gauge HPPE liner gloves with a polyurethane palm coating, rated Level 5 for cut resistance under EN 388. They are intended for handling sheet metal, glass, castings and machined components with sharp edges, where a leather glove is too clumsy and a plain cotton glove offers no protection.\n\nThe thin PU coating gives a dry grip and enough tactile feedback to handle small fasteners and instruments, so operators are less likely to remove the gloves for fine work.",
    specifications: [
      { name: "Product Type", value: "Cut Resistant Safety Gloves" },
      { name: "Liner", value: "HPPE / glass fibre blend, 13 gauge" },
      { name: "Coating", value: "Polyurethane, palm coated" },
      { name: "Cut Resistance", value: "EN 388 Level 5 / ANSI A4" },
      { name: "Abrasion Resistance", value: "EN 388 Level 4" },
      { name: "Cuff", value: "Knitted elastic wrist" },
      { name: "Sizes", value: "8 (M), 9 (L), 10 (XL)" },
      { name: "Pack", value: "12 pairs per pack" },
    ],
    applications: [
      "Handling sheet metal and cut sections",
      "Glass and ceramic component handling",
      "Machined part loading and unloading",
      "Assembly work with sharp edges",
      "Warehouse and dispatch packing",
    ],
    variants: [
      { name: "Level 3", detail: "Light assembly" },
      { name: "Level 5", detail: "Sheet metal handling" },
      { name: "Level 5 + sleeve", detail: "Forearm protection" },
    ],
  }),
  P({
    name: "Polycarbonate Safety Goggles Anti-Fog",
    sku: "SF-GG-PC",
    category: "safety-materials",
    brand: null,
    featured: false,
    short_description:
      "Wraparound polycarbonate safety goggles with anti-fog and anti-scratch coating, worn over prescription glasses.",
    description:
      "Wraparound safety goggles moulded in optical-grade polycarbonate with a hard anti-scratch outer coating and an anti-fog inner coating. The indirect side vents allow airflow without admitting flying particles, and the frame is sized to be worn over prescription spectacles.\n\nThe lens blocks 99.9 % of UV and provides medium-energy impact protection, making the goggles suitable for grinding, chipping, machining and chemical handling operations.",
    specifications: [
      { name: "Product Type", value: "Safety Goggles" },
      { name: "Lens Material", value: "Optical grade polycarbonate" },
      { name: "Lens Coating", value: "Anti-fog (inner) + anti-scratch (outer)" },
      { name: "Impact Rating", value: "Medium energy (B), EN 166 1B" },
      { name: "UV Protection", value: "99.9 % (UV400)" },
      { name: "Ventilation", value: "Indirect side vents" },
      { name: "Fit", value: "Over-spectacle (OTG) compatible" },
      { name: "Standard", value: "IS 5983 / EN 166" },
      { name: "Pack", value: "Box of 12" },
    ],
    applications: [
      "Grinding, chipping and cutting operations",
      "Machining and turning shops",
      "Chemical decanting and handling",
      "Compressed air cleaning work",
      "General plant eye protection issue",
    ],
    variants: [
      { name: "Clear lens", detail: "Indoor / general" },
      { name: "Smoke lens", detail: "Outdoor work" },
      { name: "Shade 5", detail: "Gas cutting" },
    ],
  }),
  P({
    name: "Full Body Safety Harness Double Lanyard",
    sku: "SF-FBH-DL",
    category: "safety-materials",
    brand: null,
    featured: false,
    short_description:
      "Full body fall arrest harness with two attachment points and a double lanyard with energy absorber.",
    description:
      "A full body fall-arrest harness in 45 mm polyester webbing with sternal and dorsal D-rings, adjustable thigh and shoulder straps, and forged alloy steel buckles. It is supplied with a twin-leg lanyard and integral energy absorber so the user stays connected while moving between anchor points at height.\n\nAll load-bearing stitching is contrast-coloured to make pre-use inspection straightforward, and each harness carries a serial number for register control.",
    specifications: [
      { name: "Product Type", value: "Full Body Fall Arrest Harness" },
      { name: "Webbing", value: "45 mm polyester, 22 kN minimum breaking" },
      { name: "Attachment Points", value: "2 (sternal + dorsal D-ring)" },
      { name: "Hardware", value: "Forged alloy steel, zinc plated" },
      { name: "Lanyard", value: "Twin leg with energy absorber, 1.8 m" },
      { name: "Connectors", value: "Scaffold hooks, 22 kN" },
      { name: "Maximum User Weight", value: "140 kg" },
      { name: "Standard", value: "IS 3521 / EN 361 + EN 355" },
      { name: "Traceability", value: "Individually serial numbered" },
    ],
    applications: [
      "Work at height on structures and platforms",
      "Maintenance on overhead cranes and conveyors",
      "Tank, silo and vessel entry work",
      "Erection and commissioning at height",
      "Roof and gantry maintenance",
    ],
    variants: [
      { name: "Single lanyard", detail: "Fixed position work" },
      { name: "Double lanyard", detail: "100 % tie-off while moving" },
    ],
  }),

  /* ------------------------------------------------- material handling */
  P({
    name: "BOSS Chain Pulley Block 2 Ton x 3 Metre",
    sku: "BS-CPB-2T",
    category: "material-handling",
    brand: "boss",
    featured: true,
    short_description:
      "2 tonne manual chain pulley block with 3 m lift, Grade 80 load chain and forged safety latch hooks.",
    description:
      "A 2 tonne capacity manual chain pulley block with a 3 metre standard lift, built around a hardened alloy load wheel and Grade 80 alloy steel load chain. The gear train is enclosed and grease-packed, and the Weston-type load brake holds the load securely at any point of travel.\n\nTop and bottom hooks are drop-forged, heat-treated and fitted with safety latches, and both swivel through 360° so the block can be rigged in line with the load. Each unit is proof load tested before dispatch with a test certificate supplied.",
    specifications: [
      { name: "Brand", value: "BOSS" },
      { name: "Product Type", value: "Manual Chain Pulley Block" },
      { name: "Capacity", value: "2,000 kg (2 tonne)" },
      { name: "Standard Lift", value: "3 metres" },
      { name: "Load Chain", value: "Grade 80 alloy steel, 6 x 18 mm" },
      { name: "Number of Falls", value: "1" },
      { name: "Hand Chain Pull", value: "34 kg at full load" },
      { name: "Hooks", value: "Drop forged, 360° swivel, safety latch" },
      { name: "Test", value: "Proof load tested at 1.5 × SWL" },
      { name: "Standard", value: "IS 3832" },
      { name: "Net Weight", value: "16 kg" },
    ],
    applications: [
      "Lifting dies, moulds and machine assemblies",
      "Loading and unloading on shop floors",
      "Machine installation and shifting",
      "Maintenance lifts on gantries and I-beams",
      "Foundry and fabrication shop handling",
    ],
    variants: [
      { name: "1 T x 3 m", detail: "Light handling" },
      { name: "2 T x 3 m", detail: "Standard" },
      { name: "3 T x 3 m", detail: "Heavy handling" },
      { name: "5 T x 3 m", detail: "Heavy machinery" },
    ],
  }),
  P({
    name: "Hydraulic Hand Pallet Truck 2500 kg",
    sku: "MH-HPT-25",
    category: "material-handling",
    brand: null,
    featured: false,
    short_description:
      "2500 kg hand pallet truck with 685 mm fork width, overload valve and nylon steer wheels.",
    description:
      "A 2500 kg capacity hydraulic hand pallet truck with a three-position control lever for lift, neutral and lower. The welded fork frame is made from high-tensile steel section and the pump unit includes an overload relief valve that protects the hydraulics if the truck is over-loaded.\n\nNylon steer wheels and tandem polyurethane load rollers give low rolling resistance on concrete floors while remaining kind to floor coatings, and the entry-and-exit rollers are profiled for easy pallet engagement.",
    specifications: [
      { name: "Product Type", value: "Hydraulic Hand Pallet Truck" },
      { name: "Rated Capacity", value: "2,500 kg" },
      { name: "Fork Length", value: "1,150 mm" },
      { name: "Overall Fork Width", value: "685 mm" },
      { name: "Lowered Height", value: "85 mm" },
      { name: "Raised Height", value: "200 mm" },
      { name: "Steer Wheels", value: "Nylon, 180 mm" },
      { name: "Load Rollers", value: "Tandem polyurethane, 80 mm" },
      { name: "Pump", value: "3-position with overload valve" },
      { name: "Net Weight", value: "72 kg" },
    ],
    applications: [
      "Moving palletised material within the plant",
      "Loading and unloading trucks at the dock",
      "Stores and warehouse handling",
      "Feeding raw material to production lines",
      "Finished goods dispatch handling",
    ],
    variants: [
      { name: "2,000 kg", detail: "Standard duty" },
      { name: "2,500 kg", detail: "Heavy duty" },
      { name: "3,000 kg", detail: "Extra heavy duty" },
    ],
  }),
  P({
    name: "Polyester Webbing Sling 3 Ton x 3 Metre",
    sku: "MH-WS-3T",
    category: "material-handling",
    brand: null,
    featured: false,
    short_description:
      "3 tonne flat woven polyester webbing sling with reinforced eyes and 7:1 safety factor.",
    description:
      "A flat woven polyester webbing sling rated 3 tonnes in straight pull with a 7:1 design factor. Polyester webbing does not mark or score finished surfaces the way chain or wire rope does, which makes it the right choice for lifting machined components, painted assemblies and stainless fabrications.\n\nThe eyes are reinforced with additional webbing layers and the sling carries a sewn-in label with WLL for each rigging configuration, capacity, length and traceability number.",
    specifications: [
      { name: "Product Type", value: "Flat Woven Webbing Sling" },
      { name: "Working Load Limit", value: "3,000 kg (straight pull)" },
      { name: "Effective Length", value: "3 metres" },
      { name: "Material", value: "100 % polyester" },
      { name: "Safety Factor", value: "7:1" },
      { name: "Width", value: "90 mm" },
      { name: "Colour Code", value: "Yellow (3 T per EN 1492-1)" },
      { name: "Eyes", value: "Reinforced, soft eye both ends" },
      { name: "Standard", value: "IS 15041 / EN 1492-1" },
    ],
    applications: [
      "Lifting machined and painted components",
      "Handling stainless steel fabrications",
      "Choke and basket hitch lifting",
      "Machinery shifting and installation",
      "General workshop and site rigging",
    ],
    variants: [
      { name: "1 T (violet)", detail: "Light lifts" },
      { name: "2 T (green)", detail: "General" },
      { name: "3 T (yellow)", detail: "Standard" },
      { name: "5 T (red)", detail: "Heavy lifts" },
    ],
  }),

  /* ------------------------------------------------------------ fasteners */
  P({
    name: "High Tensile Hex Bolt M12 Grade 8.8 — Box of 100",
    sku: "FS-HT-M12",
    category: "fasteners",
    brand: null,
    featured: false,
    short_description:
      "Grade 8.8 zinc plated hexagon head bolts to DIN 933, supplied with matching nuts and washers.",
    description:
      "Property class 8.8 hexagon head bolts manufactured to DIN 933 with a full thread and rolled thread form for higher fatigue strength. The zinc plating gives general indoor and sheltered outdoor corrosion protection, and the head is marked with the grade so it can be identified after installation.\n\nSupplied boxed in hundreds with matching nuts and plain washers, so a maintenance store can hold a complete bolt-up kit for one size rather than three separate lines.",
    specifications: [
      { name: "Product Type", value: "Hexagon Head Bolt, Full Thread" },
      { name: "Size", value: "M12 x 50 mm" },
      { name: "Property Class", value: "8.8 (high tensile)" },
      { name: "Tensile Strength", value: "800 N/mm² minimum" },
      { name: "Thread", value: "M12 x 1.75 coarse, rolled" },
      { name: "Standard", value: "DIN 933 / IS 1364" },
      { name: "Finish", value: "Zinc plated (electroplated)" },
      { name: "Supplied With", value: "Matching nuts and plain washers" },
      { name: "Pack", value: "Box of 100 sets" },
    ],
    applications: [
      "Structural and machine base bolting",
      "Flange and coupling assembly",
      "Foundation and frame fixing",
      "Conveyor and structure erection",
      "General maintenance bolt-up work",
    ],
    variants: [
      { name: "M8 / M10 / M12 / M16 / M20", detail: "Common sizes" },
      { name: "Grade 8.8", detail: "High tensile, zinc plated" },
      { name: "SS 304 / SS 316", detail: "Stainless options" },
    ],
  }),
  P({
    name: "Stainless Steel 304 Hex Nut & Bolt Assortment",
    sku: "FS-SS304-AST",
    category: "fasteners",
    brand: null,
    featured: false,
    short_description:
      "Graded SS 304 nut, bolt and washer assortment from M5 to M12 in a compartment organiser box.",
    description:
      "An assortment of A2 / SS 304 stainless steel hexagon bolts, nuts, plain washers and spring washers in sizes M5 to M12, arranged in a labelled compartment box. Stainless fasteners are used where corrosion, washdown or food-grade requirements rule out plated mild steel.\n\nThe assortment is intended for maintenance vans and breakdown kits, where carrying the right stainless fastener saves a return trip to the stores.",
    specifications: [
      { name: "Product Type", value: "Stainless Fastener Assortment" },
      { name: "Material", value: "Stainless Steel A2 / AISI 304" },
      { name: "Sizes", value: "M5, M6, M8, M10, M12" },
      { name: "Contents", value: "Hex bolts, nuts, plain + spring washers" },
      { name: "Bolt Lengths", value: "16 – 60 mm" },
      { name: "Total Pieces", value: "Approximately 480" },
      { name: "Standard", value: "DIN 933 / DIN 934" },
      { name: "Packing", value: "Compartment organiser box" },
    ],
    applications: [
      "Corrosion-prone and washdown areas",
      "Food and pharma plant maintenance",
      "Outdoor structures and enclosures",
      "Maintenance van and breakdown kits",
      "Instrumentation and panel mounting",
    ],
    variants: [
      { name: "SS 304 (A2)", detail: "General corrosion resistance" },
      { name: "SS 316 (A4)", detail: "Chemical / marine duty" },
    ],
  }),

  /* ----------------------------------------------------------- lubricants */
  P({
    name: "Multipurpose Lithium EP2 Grease 500 g",
    sku: "LB-EP2-500",
    category: "lubricants",
    brand: null,
    featured: false,
    short_description:
      "Lithium complex EP2 grease with extreme-pressure additives for bearings, bushes and general plant greasing.",
    description:
      "A lithium soap thickened NLGI 2 grease fortified with extreme-pressure and anti-wear additives for use in rolling element bearings, plain bearings, pins and bushes under shock load. It resists water washout and remains pumpable through centralised greasing lines at normal ambient temperatures.\n\nThe grease is compatible with most other lithium greases, so it can generally be introduced during routine re-greasing without a full purge of the bearing.",
    specifications: [
      { name: "Product Type", value: "Lithium Complex EP Grease" },
      { name: "NLGI Grade", value: "2" },
      { name: "Thickener", value: "Lithium soap" },
      { name: "Base Oil Viscosity", value: "160 cSt at 40 °C" },
      { name: "Operating Temperature", value: "-20 °C to +130 °C" },
      { name: "Dropping Point", value: "≥ 190 °C" },
      { name: "Additives", value: "Extreme pressure, anti-wear, anti-oxidant" },
      { name: "Water Washout", value: "≤ 5 % at 79 °C" },
      { name: "Pack Size", value: "500 g tub" },
    ],
    applications: [
      "Rolling element and plain bearing greasing",
      "Pins, bushes and linkages under shock load",
      "Electric motor and pump bearings",
      "Centralised lubrication systems",
      "General plant preventive maintenance",
    ],
    variants: [
      { name: "500 g tub", detail: "Maintenance pack" },
      { name: "1 kg tub", detail: "Shop floor pack" },
      { name: "18 kg pail", detail: "Bulk pack" },
    ],
  }),
  P({
    name: "Water Soluble Cutting Oil 20 Litre",
    sku: "LB-CO-20L",
    category: "lubricants",
    brand: null,
    featured: false,
    short_description:
      "Semi-synthetic soluble cutting oil concentrate giving a stable emulsion with good cooling and rust protection.",
    description:
      "A semi-synthetic soluble cutting oil concentrate that emulsifies readily in hard water to give a stable, low-foam coolant. It combines the cooling capability of a synthetic with enough lubricity for turning, milling, drilling and general machining of steel and cast iron.\n\nThe formulation includes corrosion inhibitors that protect both the machine tool and freshly machined surfaces, plus a biocide package that extends sump life and reduces the odour problems associated with stale coolant.",
    specifications: [
      { name: "Product Type", value: "Semi-Synthetic Soluble Cutting Oil" },
      { name: "Recommended Dilution", value: "1:20 (5 %) general machining" },
      { name: "Appearance (neat)", value: "Amber liquid" },
      { name: "Emulsion Appearance", value: "Translucent, milky" },
      { name: "pH at 5 %", value: "8.8 – 9.4" },
      { name: "Corrosion Protection", value: "Pass, IP 287 cast iron chip test" },
      { name: "Foam", value: "Low foaming, suitable for high pressure" },
      { name: "Pack Size", value: "20 litre can" },
    ],
    applications: [
      "Turning, milling and drilling steel and cast iron",
      "CNC machining centre coolant",
      "Surface and cylindrical grinding",
      "Tapping and reaming operations",
      "General machine shop coolant supply",
    ],
    variants: [
      { name: "5 litre", detail: "Small shop pack" },
      { name: "20 litre", detail: "Standard can" },
      { name: "210 litre", detail: "Barrel" },
    ],
  }),
  P({
    name: "Rust Remover & Penetrating Spray 400 ml",
    sku: "LB-RP-400",
    category: "lubricants",
    brand: null,
    featured: false,
    short_description:
      "Low-viscosity penetrating spray that frees seized fasteners, displaces moisture and leaves a light film.",
    description:
      "A low surface tension penetrating oil in an aerosol pack that creeps into rusted and seized threads by capillary action, breaking down the corrosion bond so fasteners can be released without heat or damage. It also displaces moisture and leaves a thin residual film that inhibits further rusting.\n\nSupplied with an extension nozzle for reaching fasteners inside guards and enclosures, which is where most seized studs are found.",
    specifications: [
      { name: "Product Type", value: "Penetrating Oil / Rust Release Spray" },
      { name: "Form", value: "Aerosol with extension nozzle" },
      { name: "Net Volume", value: "400 ml" },
      { name: "Action", value: "Penetrates, frees, lubricates, protects" },
      { name: "Moisture Displacing", value: "Yes" },
      { name: "Dielectric Strength", value: "Suitable for electrical use" },
      { name: "Service Temperature", value: "-20 °C to +120 °C" },
      { name: "Pack", value: "Carton of 12 cans" },
    ],
    applications: [
      "Freeing seized nuts, bolts and studs",
      "Releasing rusted pins, hinges and linkages",
      "Moisture displacement on electrical parts",
      "Light lubrication of chains and cables",
      "Short-term corrosion protection of tools",
    ],
    variants: [
      { name: "200 ml", detail: "Pocket can" },
      { name: "400 ml", detail: "Standard can" },
    ],
  }),

  /* ------------------------------------------- hardware / consumables */
  P({
    name: "Heavy Duty Swivel Castor Wheel 125 mm with Brake",
    sku: "IH-CW-125B",
    category: "industrial-hardware",
    brand: null,
    featured: false,
    short_description:
      "125 mm polyurethane swivel castor with total-lock brake, 200 kg capacity and double ball race top plate.",
    description:
      "A 125 mm heavy duty swivel castor with a polyurethane tread bonded to a cast nylon centre, rated 200 kg per wheel. The double ball race swivel head gives light steering under load and the pressed steel top plate is zinc plated for corrosion resistance.\n\nThe total-lock brake stops both the wheel rotation and the swivel action, so trolleys and fixtures stay put when the brake is applied — important on trolleys used as temporary work stands.",
    specifications: [
      { name: "Product Type", value: "Swivel Castor with Total Lock Brake" },
      { name: "Wheel Diameter", value: "125 mm" },
      { name: "Tread Material", value: "Polyurethane on nylon centre" },
      { name: "Load Capacity", value: "200 kg per castor" },
      { name: "Bearing", value: "Precision ball bearing wheel" },
      { name: "Swivel Head", value: "Double ball race, zinc plated" },
      { name: "Top Plate", value: "105 x 85 mm, 4 bolt holes" },
      { name: "Overall Height", value: "158 mm" },
      { name: "Brake", value: "Total lock (wheel + swivel)" },
    ],
    applications: [
      "Material handling trolleys and platform trucks",
      "Tool cabinets and workshop cupboards",
      "Machine bases requiring mobility",
      "Assembly fixtures and work stands",
      "Warehouse cage trolleys",
    ],
    variants: [
      { name: "100 mm / 150 kg", detail: "Light duty" },
      { name: "125 mm / 200 kg", detail: "Standard" },
      { name: "200 mm / 400 kg", detail: "Heavy duty" },
    ],
  }),
  P({
    name: "MS Welding Electrode E6013 3.15 mm — 5 kg",
    sku: "IC-WE-6013",
    category: "industrial-consumables",
    brand: null,
    featured: false,
    short_description:
      "Rutile coated E6013 general purpose electrode for smooth arc welding of mild steel in all positions.",
    description:
      "A rutile-coated E6013 general purpose electrode giving a soft, stable arc, easy slag removal and neat bead appearance on mild steel. It strikes and re-strikes readily on AC or DC in all positions, which makes it the standard choice for fabrication and maintenance welding on thin to medium sections.\n\nSupplied in 5 kg cartons and moisture-resistant packing so the coating stays in condition in humid shop-floor storage.",
    specifications: [
      { name: "Product Type", value: "MS Welding Electrode" },
      { name: "Classification", value: "AWS E6013 / IS 814 ER 4211X" },
      { name: "Coating", value: "Rutile" },
      { name: "Diameter x Length", value: "3.15 x 350 mm" },
      { name: "Current Range", value: "90 – 130 A" },
      { name: "Polarity", value: "AC or DC (either polarity)" },
      { name: "Welding Positions", value: "All positions" },
      { name: "Tensile Strength", value: "430 – 510 N/mm²" },
      { name: "Pack Size", value: "5 kg carton" },
    ],
    applications: [
      "General mild steel fabrication welding",
      "Sheet metal and light structural work",
      "Maintenance and repair welding",
      "Tack welding during fit-up",
      "Site erection welding",
    ],
    variants: [
      { name: "2.50 mm", detail: "Thin sheet" },
      { name: "3.15 mm", detail: "General purpose" },
      { name: "4.00 mm", detail: "Heavier sections" },
    ],
  }),
  P({
    name: "Industrial Deep Groove Ball Bearing 6205 2RS",
    sku: "OT-BR-6205",
    category: "other-industrial-products",
    brand: null,
    featured: false,
    short_description:
      "Sealed deep groove ball bearing 25 x 52 x 15 mm for electric motors, pumps and general machinery.",
    description:
      "A single row deep groove ball bearing, 25 mm bore, with rubber contact seals on both sides and factory grease fill for maintenance-free service. Deep groove bearings carry radial load together with moderate axial load in either direction, which is why they cover the majority of electric motor, pump and gearbox applications.\n\nThe 2RS seals retain grease and exclude dust and splash water, making the bearing suitable for shop floor environments without a separate sealing arrangement.",
    specifications: [
      { name: "Product Type", value: "Deep Groove Ball Bearing" },
      { name: "Designation", value: "6205 2RS" },
      { name: "Bore Diameter", value: "25 mm" },
      { name: "Outside Diameter", value: "52 mm" },
      { name: "Width", value: "15 mm" },
      { name: "Sealing", value: "Rubber contact seals, both sides (2RS)" },
      { name: "Dynamic Load Rating", value: "14.0 kN" },
      { name: "Static Load Rating", value: "7.85 kN" },
      { name: "Limiting Speed", value: "9,000 rpm (sealed)" },
      { name: "Lubrication", value: "Pre-greased for life" },
    ],
    applications: [
      "Electric motor and alternator bearings",
      "Centrifugal pump and blower shafts",
      "Gearbox and reduction unit support",
      "Conveyor idlers and rollers",
      "General rotating machinery maintenance",
    ],
    variants: [
      { name: "6204 2RS", detail: "20 mm bore" },
      { name: "6205 2RS", detail: "25 mm bore" },
      { name: "6206 2RS", detail: "30 mm bore" },
    ],
  }),
];

/* ------------------------------------------------------------------ seeding */

function reset() {
  db.exec(`
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM brands;
    DELETE FROM sqlite_sequence WHERE name IN ('products','categories','brands');
  `);
}

if (RESET) {
  reset();
  console.log("Cleared products, categories and brands.");
}

const idBySlug = (table, slug) => {
  const row = db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(slug);
  return row ? Number(row.id) : null;
};

let counts = { categories: 0, brands: 0, products: 0, admin: 0, enquiries: 0 };

const insertCategory = db.prepare(
  `INSERT INTO categories (name, slug, description, image, active, sort_order)
   VALUES (?, ?, ?, ?, 1, ?)`,
);
CATEGORIES.forEach((category, index) => {
  if (idBySlug("categories", category.slug)) return;
  insertCategory.run(
    category.name,
    category.slug,
    category.description,
    art(category.slug),
    index,
  );
  counts.categories += 1;
});

const insertBrand = db.prepare(
  `INSERT INTO brands (name, slug, description, logo, active, sort_order)
   VALUES (?, ?, ?, '', 1, ?)`,
);
BRANDS.forEach((brand, index) => {
  if (idBySlug("brands", brand.slug)) return;
  insertBrand.run(brand.name, brand.slug, brand.description, index);
  counts.brands += 1;
});

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

const insertProduct = db.prepare(
  `INSERT INTO products
    (name, slug, sku, category_id, brand_id, short_description, description,
     image, gallery, specifications, applications, variants, featured,
     published, meta_title, meta_description)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
);

for (const product of PRODUCTS) {
  const slug = slugify(product.name);
  if (idBySlug("products", slug)) continue;

  const categoryId = idBySlug("categories", product.category);
  const brandId = product.brand ? idBySlug("brands", product.brand) : null;
  const categoryName =
    CATEGORIES.find((c) => c.slug === product.category)?.name ?? "";
  const brandName = product.brand
    ? (BRANDS.find((b) => b.slug === product.brand)?.name ?? "")
    : "";

  const metaTitle = `${product.name}${brandName ? ` | ${brandName}` : ""} — Kolhapur`;
  const metaDescription = `${product.short_description} Available from Industrial Prime System & Vijay Enterprises, ${categoryName} suppliers in MIDC Shiroli, Kolhapur. Enquire on WhatsApp.`.slice(
    0,
    300,
  );

  insertProduct.run(
    product.name,
    slug,
    product.sku,
    categoryId,
    brandId,
    product.short_description,
    product.description,
    art(product.category),
    JSON.stringify([]),
    JSON.stringify(product.specifications),
    JSON.stringify(product.applications),
    JSON.stringify(product.variants ?? []),
    product.featured ? 1 : 0,
    metaTitle,
    metaDescription,
  );
  counts.products += 1;
}

/* Admin user */
const adminCount = Number(
  db.prepare("SELECT COUNT(*) AS n FROM admin_users").get().n,
);
if (adminCount === 0) {
  const email = process.env.ADMIN_EMAIL || "admin@industrialprime.in";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  db.prepare(
    "INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)",
  ).run("Administrator", email, bcrypt.hashSync(password, 10));
  counts.admin = 1;
  console.log(`\nAdmin login created:\n  email:    ${email}\n  password: ${password}\n`);
}

/* A couple of demo enquiries so the dashboard is not empty on first login. */
const enquiryCount = Number(
  db.prepare("SELECT COUNT(*) AS n FROM enquiries").get().n,
);
if (enquiryCount === 0) {
  const demo = [
    {
      name: "Sagar Kulkarni",
      company: "Precision Auto Components Pvt Ltd",
      phone: "9822011234",
      email: "purchase@precisionauto.example",
      product: "ANABOND 114 Thread Locking Compound",
      quantity: "24 bottles (50 ml)",
      message:
        "Please quote for 24 bottles of ANABOND 114 with delivery to Gokul Shirgaon MIDC. Also share the rate for the 250 ml pack.",
      status: "New",
    },
    {
      name: "Rohit Deshmukh",
      company: "Deshmukh Engineering Works",
      phone: "9765043210",
      email: "rohit@deshmukhengg.example",
      product: "BOSS Chain Pulley Block 2 Ton x 3 Metre",
      quantity: "2 nos",
      message:
        "Need two 2 ton chain pulley blocks with test certificates. Please confirm availability and lead time.",
      status: "Contacted",
    },
    {
      name: "Amit Jadhav",
      company: "Shree Fabricators",
      phone: "9890567890",
      email: "",
      product: "Golden Bullet Cut-Off Wheel 4 inch",
      quantity: "10 boxes",
      message:
        "Regular requirement of 4 inch cutting wheels, around 10 boxes per month. Please share your best monthly rate.",
      status: "Quoted",
    },
  ];

  const insertEnquiry = db.prepare(
    `INSERT INTO enquiries (name, company, phone, email, product, quantity, message, source, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Website', ?)`,
  );
  for (const e of demo) {
    insertEnquiry.run(
      e.name,
      e.company,
      e.phone,
      e.email,
      e.product,
      e.quantity,
      e.message,
      e.status,
    );
    counts.enquiries += 1;
  }
}

console.log("Seed complete:");
console.log(`  categories : +${counts.categories}`);
console.log(`  brands     : +${counts.brands}`);
console.log(`  products   : +${counts.products}`);
console.log(`  enquiries  : +${counts.enquiries}`);
console.log(`  admin users: +${counts.admin}`);
console.log(`\nDatabase: ${DB_PATH}`);

db.close();
