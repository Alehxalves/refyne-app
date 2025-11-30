import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      bg: { base: "{colors.app.bg}", _dark: "{colors.app.bgDark}" },
      color: { base: "{colors.text.base}", _dark: "{colors.text.inverse}" },
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: "monospace" },
        heading: { value: "monospace" },
        mono: { value: "monospace" },
      },
      fontSizes: {
        xs: { value: "0.90rem" },
        sm: { value: "1.00rem" },
        md: { value: "1.125rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.50rem" },
        "2xl": { value: "1.875rem" },
        "3xl": { value: "2.25rem" },
        "4xl": { value: "3rem" },
        "5xl": { value: "3.75rem" },
        "6xl": { value: "4.50rem" },
      },
      colors: {
        blue: {
          950: { value: "#0C142E" },
          900: { value: "#14204A" },
          800: { value: "#1A3478" },
          700: { value: "#173DA6" },
          600: { value: "#2563EB" },
          500: { value: "#3B82F6" },
          400: { value: "#60A5FA" },
          300: { value: "#A3CFFF" },
          200: { value: "#BFDBFE" },
          100: { value: "#DBEAFE" },
          50: { value: "#E4E4E7" },
        },
        gray: {
          950: { value: "#111111" },
          900: { value: "#18181B" },
          800: { value: "#27272A" },
          700: { value: "#3F3F46" },
          600: { value: "#52525B" },
          500: { value: "#71717A" },
          400: { value: "#A1A1AA" },
          300: { value: "#D4D4D8" },
          200: { value: "#E4E4E7" },
          100: { value: "#F4F4F5" },
          50: { value: "#FAFAFA" },
        },
        green: {
          950: { value: "#03190C" },
          900: { value: "#042713" },
          800: { value: "#124A28" },
          700: { value: "#116932" },
          600: { value: "#16A34A" },
          500: { value: "#22C55E" },
          400: { value: "#4ADE80" },
          300: { value: "#86EFAC" },
          200: { value: "#BBF7D0" },
          100: { value: "#DCFCE7" },
          50: { value: "#F0FDF4" },
        },
        orange: {
          950: { value: "#220A04" },
          900: { value: "#3B1106" },
          800: { value: "#6C2710" },
          700: { value: "#92310A" },
          600: { value: "#EA580C" },
          500: { value: "#F97316" },
          400: { value: "#FB923C" },
          300: { value: "#FDBA74" },
          200: { value: "#FED7AA" },
          100: { value: "#FFEDD5" },
          50: { value: "#FFF7ED" },
        },
        red: {
          950: { value: "#1F0808" },
          900: { value: "#300C0C" },
          800: { value: "#511111" },
          700: { value: "#991919" },
          600: { value: "#DC2626" },
          500: { value: "#EF4444" },
          400: { value: "#F87171" },
          300: { value: "#FCA5A5" },
          200: { value: "#FECACA" },
          100: { value: "#FEE2E2" },
          50: { value: "#FEF2F2" },
        },
        yellow: {
          950: { value: "#281304" },
          900: { value: "#422006" },
          800: { value: "#713F12" },
          700: { value: "#845209" },
          600: { value: "#CA8A04" },
          500: { value: "#EAB308" },
          400: { value: "#FACC15" },
          300: { value: "#FDE047" },
          200: { value: "#FEF08A" },
          100: { value: "#FEF9C3" },
          50: { value: "#FEFCE8" },
        },

        darkblue: {
          400: { value: "#101724" },
          300: { value: "#141D2A" },
          200: { value: "#192431" },
          100: { value: "#2C3849" },
        },

        app: {
          bg: { value: "#EDEEEF" },
          bgDark: { value: "#27272A" },
        },
        default: {
          bg: { value: "#EDEEEF" },
          bgDark: { value: "#27272A" },
        },
        text: {
          base: { value: "{colors.gray.900}" },
          inverse: { value: "{colors.gray.50}" },
          darkText: { value: "#EDEEEF" },
          darkSubtitle: { value: "#8C98A9" },
        },
        primary: {
          base: { value: "{colors.green.600}" },
          dark: { value: "{colors.green.400}" },
        },
        error: {
          base: { value: "{colors.red.500}" },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          value: {
            base: "{colors.primary.base}",
            _dark: "{colors.primary.dark}",
          },
        },
        text: {
          value: { base: "{colors.text.base}", _dark: "{colors.text.inverse}" },
        },
        error: {
          value: "{colors.error.base}",
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
