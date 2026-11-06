-- INKORA seed data.
-- All tattoo images below are synthetic INKORA demo assets (not scraped portfolios).
-- image_path values point at Next.js public demo files for local development.

begin;

-- Taxonomies
insert into public.categories (id, name, slug, description) values
  ('11111111-1111-4111-8111-111111111101', 'Animals', 'animals', 'Creatures and fauna motifs.'),
  ('11111111-1111-4111-8111-111111111102', 'Nature', 'nature', 'Botanical, celestial, and landscape ideas.'),
  ('11111111-1111-4111-8111-111111111103', 'Geometry', 'geometry', 'Structured shapes and ornamental line systems.');

insert into public.styles (id, name, slug, description) values
  ('22222222-2222-4222-8222-222222222201', 'Fine Line', 'fine-line', 'Delicate single-needle inspired linework.'),
  ('22222222-2222-4222-8222-222222222202', 'Blackwork', 'blackwork', 'Bold black forms and graphic contrast.'),
  ('22222222-2222-4222-8222-222222222203', 'Ornamental', 'ornamental', 'Symmetry, filigree, and decorative structure.'),
  ('22222222-2222-4222-8222-222222222204', 'Minimal', 'minimal', 'Sparse marks with strong negative space.');

insert into public.placements (id, name, slug, description) values
  ('33333333-3333-4333-8333-333333333301', 'Forearm', 'forearm', 'Inner or outer forearm compositions.'),
  ('33333333-3333-4333-8333-333333333302', 'Shoulder', 'shoulder', 'Shoulder cap and upper arm transitions.'),
  ('33333333-3333-4333-8333-333333333303', 'Spine', 'spine', 'Vertical back placements.'),
  ('33333333-3333-4333-8333-333333333304', 'Ribs', 'ribs', 'Side-body placements with flow.');

insert into public.tags (id, name, slug) values
  ('44444444-4444-4444-8444-444444444401', 'Serpent', 'serpent'),
  ('44444444-4444-4444-8444-444444444402', 'Floral', 'floral'),
  ('44444444-4444-4444-8444-444444444403', 'Moon', 'moon'),
  ('44444444-4444-4444-8444-444444444404', 'Symmetry', 'symmetry'),
  ('44444444-4444-4444-8444-444444444405', 'First tattoo', 'first-tattoo');

-- Published demo tattoos (synthetic artwork)
insert into public.tattoos (
  id, title, slug, description, category_id, image_path, image_alt,
  image_width, image_height, source, attribution, license,
  is_demo, is_published, is_featured
) values
  (
    '55555555-5555-4555-8555-555555555501',
    'Line Serpent',
    'line-serpent',
    'A continuous fine-line serpent study meant for forearm flow.',
    '11111111-1111-4111-8111-111111111101',
    '/demo/tattoos/line-serpent.svg',
    'Synthetic demo illustration of a fine-line serpent',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, true, true
  ),
  (
    '55555555-5555-4555-8555-555555555502',
    'Shoulder Bloom',
    'shoulder-bloom',
    'Soft botanical silhouette for a shoulder placement.',
    '11111111-1111-4111-8111-111111111102',
    '/demo/tattoos/floral-shoulder.svg',
    'Synthetic demo illustration of a floral shoulder motif',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, true, true
  ),
  (
    '55555555-5555-4555-8555-555555555503',
    'Triad Geometry',
    'triad-geometry',
    'Stacked triangles and axis line for a structured forearm piece.',
    '11111111-1111-4111-8111-111111111103',
    '/demo/tattoos/geometric-forearm.svg',
    'Synthetic demo illustration of geometric forearm forms',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, true, false
  ),
  (
    '55555555-5555-4555-8555-555555555504',
    'Quiet Moon',
    'quiet-moon',
    'Minimal crescent with sparse marks — a gentle first-tattoo option.',
    '11111111-1111-4111-8111-111111111102',
    '/demo/tattoos/minimal-moon.svg',
    'Synthetic demo illustration of a minimal moon',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, true, true
  ),
  (
    '55555555-5555-4555-8555-555555555505',
    'Ornamental Axis',
    'ornamental-axis',
    'Symmetrical ornamental rhythm drafted for a spine placement.',
    '11111111-1111-4111-8111-111111111103',
    '/demo/tattoos/ornamental-spine.svg',
    'Synthetic demo illustration of an ornamental spine design',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, true, false
  ),
  (
    '55555555-5555-4555-8555-555555555599',
    'Draft Rib Study',
    'draft-rib-study',
    'Unpublished draft used to verify RLS hides non-published rows.',
    '11111111-1111-4111-8111-111111111102',
    '/demo/tattoos/minimal-moon.svg',
    'Unpublished synthetic demo illustration',
    800, 1000,
    'INKORA demo assets',
    'Original synthetic artwork created for INKORA demos',
    'Demo content — not for commercial tattoo transfer as-is',
    true, false, false
  );

insert into public.tattoo_styles (tattoo_id, style_id) values
  ('55555555-5555-4555-8555-555555555501', '22222222-2222-4222-8222-222222222201'),
  ('55555555-5555-4555-8555-555555555502', '22222222-2222-4222-8222-222222222201'),
  ('55555555-5555-4555-8555-555555555502', '22222222-2222-4222-8222-222222222203'),
  ('55555555-5555-4555-8555-555555555503', '22222222-2222-4222-8222-222222222202'),
  ('55555555-5555-4555-8555-555555555504', '22222222-2222-4222-8222-222222222204'),
  ('55555555-5555-4555-8555-555555555505', '22222222-2222-4222-8222-222222222203'),
  ('55555555-5555-4555-8555-555555555599', '22222222-2222-4222-8222-222222222201');

insert into public.tattoo_placements (tattoo_id, placement_id) values
  ('55555555-5555-4555-8555-555555555501', '33333333-3333-4333-8333-333333333301'),
  ('55555555-5555-4555-8555-555555555502', '33333333-3333-4333-8333-333333333302'),
  ('55555555-5555-4555-8555-555555555503', '33333333-3333-4333-8333-333333333301'),
  ('55555555-5555-4555-8555-555555555504', '33333333-3333-4333-8333-333333333304'),
  ('55555555-5555-4555-8555-555555555505', '33333333-3333-4333-8333-333333333303'),
  ('55555555-5555-4555-8555-555555555599', '33333333-3333-4333-8333-333333333304');

insert into public.tattoo_tags (tattoo_id, tag_id) values
  ('55555555-5555-4555-8555-555555555501', '44444444-4444-4444-8444-444444444401'),
  ('55555555-5555-4555-8555-555555555502', '44444444-4444-4444-8444-444444444402'),
  ('55555555-5555-4555-8555-555555555503', '44444444-4444-4444-8444-444444444404'),
  ('55555555-5555-4555-8555-555555555504', '44444444-4444-4444-8444-444444444403'),
  ('55555555-5555-4555-8555-555555555504', '44444444-4444-4444-8444-444444444405'),
  ('55555555-5555-4555-8555-555555555505', '44444444-4444-4444-8444-444444444404');

commit;
