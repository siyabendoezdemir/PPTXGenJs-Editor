export async function generateCode(elements: PptElement[]): Promise<string> {

    let code = `
    import PptxGenJS from "pptxgenjs";
    
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    `;

    elements.forEach(element => {
        if (element.type === 'rect') {
            code += `
    slide.addShape(pptx.ShapeType.rect, {
      x: ${element.x / 96},
      y: ${element.y / 96},
      w: ${element.width / 96},
      h: ${element.height / 96},
      fill: { color: "FF0000" }
    });
    `;
        } else if (element.type === 'text') {
            code += `
    slide.addText("Sample Text", {
      x: ${element.x / 96},
      y: ${element.y / 96},
      w: ${element.width / 96},
      h: ${element.height / 96},
      color: "363636",
      fill: { color: "F1F1F1" },
      align: "center"
    });
    `;
        }
    });

    code += `
    pptx.writeFile({ fileName: "SamplePresentation.pptx" });
    `;

    return code;

}