import pptxgen from 'pptxgenjs';

/**
 * Generate PowerPoint presentation from data
 * @param {Object} presentationData - Presentation data with title and slides
 * @returns {pptxgen} PowerPoint generator instance
 */
export const generatePPT = (presentationData) => {
  const ppt = new pptxgen();

  // Set presentation properties
  ppt.author = 'AI PowerPoint Generator';
  ppt.title = presentationData.title;
  ppt.subject = 'AI Generated Presentation';
  ppt.company = 'AI PPT Generator';

  presentationData.slides.forEach((slideData, index) => {
    const slide = ppt.addSlide();

    if (slideData.layout === 'title') {
      // Title slide with gradient background
      slide.background = { color: '1F4788' };
      
      // Main title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 1.5,
        fontSize: 44,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
      });
      
      // Subtitle if exists
      if (slideData.content && slideData.content.length > 0) {
        slide.addText(slideData.content[0], {
          x: 0.5,
          y: 4.2,
          w: 9,
          h: 0.5,
          fontSize: 20,
          color: 'E0E0E0',
          align: 'center',
        });
      }
    } else if (slideData.layout === 'section') {
      // Section divider slide
      slide.background = { color: '2E5090' };
      
      slide.addText(slideData.title, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 1.5,
        fontSize: 40,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
      });
    } else {
      // Content slide
      slide.background = { color: 'FFFFFF' };

      // Title bar with background
      slide.addShape(ppt.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 1,
        fill: { color: '1F4788' },
      });

      // Slide title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.25,
        w: 9,
        h: 0.5,
        fontSize: 28,
        bold: true,
        color: 'FFFFFF',
      });

      // Content bullets with enhanced styling
      if (slideData.content && slideData.content.length > 0) {
        slideData.content.forEach((point, idx) => {
          // Bullet point number/marker
          slide.addText(`${idx + 1}`, {
            x: 0.75,
            y: 1.8 + idx * 0.7,
            w: 0.4,
            h: 0.4,
            fontSize: 16,
            bold: true,
            color: '1F4788',
            align: 'center',
            valign: 'middle',
          });

          // Bullet point text
          slide.addText(point, {
            x: 1.3,
            y: 1.8 + idx * 0.7,
            w: 8,
            h: 0.6,
            fontSize: 18,
            color: '333333',
            lineSpacing: 20,
          });
        });
      }

      // Slide number at bottom
      slide.addText(`${index + 1}`, {
        x: 9.2,
        y: 7.2,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: '666666',
        align: 'right',
      });
    }
  });

  return ppt;
};

/**
 * Download PowerPoint presentation
 * @param {Object} presentationData - Presentation data
 */
export const downloadPPT = (presentationData) => {
  try {
    const ppt = generatePPT(presentationData);
    const filename = `${presentationData.title.replace(/[^a-z0-9]/gi, '_')}.pptx`;
    
    ppt.writeFile({ fileName: filename });
    console.log('Presentation downloaded:', filename);
  } catch (error) {
    console.error('Error downloading presentation:', error);
    throw new Error('Failed to download presentation');
  }
};

/**
 * Generate and return presentation as blob (for future PDF conversion)
 * @param {Object} presentationData - Presentation data
 * @returns {Promise<Blob>} Presentation blob
 */
export const generatePPTBlob = async (presentationData) => {
  try {
    const ppt = generatePPT(presentationData);
    const blob = await ppt.write('blob');
    return blob;
  } catch (error) {
    console.error('Error generating presentation blob:', error);
    throw new Error('Failed to generate presentation');
  }
};

/**
 * Preview slide data (for debugging)
 * @param {Object} presentationData - Presentation data
 */
export const previewPresentationData = (presentationData) => {
  console.log('=== Presentation Preview ===');
  console.log('Title:', presentationData.title);
  console.log('Total Slides:', presentationData.slides.length);
  presentationData.slides.forEach((slide, index) => {
    console.log(`\nSlide ${index + 1}:`);
    console.log('  Title:', slide.title);
    console.log('  Layout:', slide.layout);
    console.log('  Content:', slide.content);
  });
  console.log('===========================');
};

export default {
  generatePPT,
  downloadPPT,
  generatePPTBlob,
  previewPresentationData,
};