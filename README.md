# Obsidian Precision: Scientific Calculator

A responsive scientific calculator with an Obsidian dark aesthetic, built for comfortable use on both desktop and mobile. It uses a custom AST parser engine, with no `eval()` anywhere.

## Live Demo

**[Open the calculator](https://obsidian-precision-scientific-calculator.ai.studio)**

https://obsidian-precision-scientific-calculator.ai.studio

Backup link: https://arvinthk30.github.io/scientific-calculator/

## Screenshots

### Desktop

![Desktop view](screenshots/desktop.png)

### Mobile

<img src="screenshots/mobile.png" alt="Mobile view" width="360">

## Features

### Math engine
- **AST parser engine**: expressions are parsed safely, with zero `eval()`
- **Precision to 10⁻¹²**
- **Scientific functions**: sin, cos, tan, 2nd (inverse functions), x², xʸ, √, log, ln, n!, 1/x, |x|, %, π and e
- **DEG / RAD toggle** for angle mode
- **Parentheses** for nested expressions
- **Ans** key to reuse the last result
- **Memory keys**: MC, MR, M+, M− and MS, with a live memory indicator

### Side panel
- **History**: a calculation tape with timestamps and the angle mode used for each entry
- **Constants**: quick access to common constants
- **Converter**: built-in unit conversion

### Design and usability
- **Obsidian dark aesthetic** with high-contrast colour coding: cyan for functions, orange for operators, red for clear and delete
- **Ergonomic hitboxes**: large, comfortable buttons
- **Tabular typography**: JetBrains Mono for numbers and Plus Jakarta Sans for the interface
- **Mobile thumb-zone layout** that keeps frequently used keys within easy reach
- **Mobile tabs**: switch between Calculator and Tape & Tools (history, constants, converter) to keep the keypad uncluttered on small screens
- **Full hardware keyboard support** with a built-in **Shortcuts** cheatsheet
- **Responsive design** for phones, tablets and desktops

## Tech Stack

- React with Vite and TypeScript
- Built with Google AI Studio
- Custom AST expression parser (no `eval()`)
- Fonts: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Getting Started

### Use it online

Open the [live demo](https://obsidian-precision-scientific-calculator.ai.studio). No installation needed.

### Run it locally

```bash
# 1. Clone the repository
git clone https://github.com/arvinthk30/scientific-calculator.git

# 2. Go into the project folder
cd scientific-calculator

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Start the development server
npm run dev
```

Then open the local address shown in your terminal (usually http://localhost:3000 or http://localhost:5173).

### Build for production

```bash
npm run build
```

The production files are created in the `dist` folder.

## Updating the Project

1. Make changes in Google AI Studio.
2. Sync them to this repository from the **GitHub** tab.
3. Republish from the **Publish** tab to update the live link.

## Contributing

Suggestions and improvements are welcome. Open an issue or submit a pull request.

## Author

**Arvinth**, BIM Modeler and Civil Engineer

GitHub: [@arvinthk30](https://github.com/arvinthk30)

## License

Released under the [MIT License](LICENSE).
