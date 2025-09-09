import express from 'express';

const router = express.Router();

router.post('/suggest', (req, res) => {
  const { occasion = '', outfit = '' } = req.body || {};
  const occ = String(occasion || '').toLowerCase();
  const fit = String(outfit || '').toLowerCase();

  const suggestions = [];
  const outfits = [];

  if (occ.includes('wedding') || occ.includes('engagement')) {
    suggestions.push(
      'Makeup: Dewy base, soft pink blush, champagne shimmer eyes, bold kajal, nude‑pink gloss.',
      'Jewellery: Kundan/Polki set, chandelier earrings, delicate maang tikka.'
    );
    outfits.push('Saree (silk/organza)', 'Lehenga (pastel/jewel tones)', 'Anarkali suit');
  } else if (occ.includes('party') || occ.includes('night')) {
    suggestions.push(
      'Makeup: Matte base, bronzed cheeks, smoky eyes, winged liner, bold red/burgundy lips.',
      'Jewellery: Statement earrings or layered chains.'
    );
    outfits.push('Sequined gown', 'Bodycon dress', 'Sharara co‑ord');
  } else if (occ.includes('festive') || occ.includes('diwali') || occ.includes('navratri')) {
    suggestions.push(
      'Makeup: Luminous base, coral blush, gold shimmer eyes, kohl, warm nude lips.',
      'Jewellery: Jhumkas/oxidized set with bangles.'
    );
    outfits.push('Lehenga choli', 'Contrast saree', 'Palazzo/Anarkali suit');
  } else {
    suggestions.push(
      'Makeup: Natural base, soft blush, neutral eyes, brown liner, nude gloss.',
      'Jewellery: Minimal studs/small hoops with delicate pendant.'
    );
    outfits.push('Kurti + palazzo', 'Cotton midi dress', 'Casual saree');
  }

  if (fit.includes('saree') || fit.includes('lehenga')) suggestions.push('Match: Traditional glam—add bindi and gajra.');
  if (fit.includes('gown') || fit.includes('dress')) suggestions.push('Match: Modern chic—statement earrings, skip heavy necklace.');
  if (fit.includes('kurti') || fit.includes('salwar') || fit.includes('anarkali')) suggestions.push('Match: Ethnic elegant—oxidized silver or pearls.');

  res.json({ occasion: occ, outfit: fit, suggestions, outfits });
});

export default router;


