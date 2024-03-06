import { Paragraph, Skia, TextAlign, useFonts } from "@shopify/react-native-skia";
import { useMemo } from "react";

export const TapTitle = ({width, height}) => {
  const customFontMgr = useFonts({
    Protest: [
      require("../assets/ProtestRiot-Regular.ttf")
    ],
  });

  const paragraph = useMemo(() => {
    // Are the custom fonts loaded?
    if (!customFontMgr) {
      return null;
    }
    const textStyle = {
      fontSize: 40,
      fontFamilies: ["Protest"],
      color: Skia.Color("#000"),
    };

    const paragraphBuilder = Skia.ParagraphBuilder.Make({
      textAlign: TextAlign.Center
    }, customFontMgr);
    paragraphBuilder
      .pushStyle({ ...textStyle })
      .addText("Tap to start!\n")
      .build();
    return paragraphBuilder.build();
  }, [customFontMgr]);

  return <Paragraph paragraph={paragraph} x={0} y={(height / 4) * 2} width={width} />;
};