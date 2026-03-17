# FoundTheGoodGood

> The good stuff. No fluff. Pick your tools, get your script.

A curated developer tool installer — like [Ninite](https://ninite.com) but for the modern dev toolchain. Select the tools you need, choose your OS, and get a ready-to-run install script with zero signup, zero APIs, zero databases.

**[Launch App](https://mrlfarano.github.io/FoundTheGoodGood/)**

![macOS](https://img.shields.io/badge/macOS-supported-brightgreen)
![Linux](https://img.shields.io/badge/Linux-supported-brightgreen)
![Windows](https://img.shields.io/badge/Windows-supported-brightgreen)

## What It Does

1. Browse 40+ handpicked developer tools across 6 categories
2. Select the ones you want (or hit "Select All")
3. Pick your OS — macOS, Linux, or Windows
4. Copy or download the generated install script
5. Run it. Done.

## Tool Categories

| Category | Examples |
|---|---|
| **Shell & Terminal** | Oh My Zsh, Powerlevel10k, zsh-autosuggestions, Starship, Atuin, Zoxide |
| **CLI Essentials** | fzf, bat, eza, fd, ripgrep, delta, lazygit, jq, direnv |
| **Dev Runtimes** | Homebrew, pyenv, nvm, mise |
| **DevOps & Cloud** | Docker, kubectl, k9s, Helm, OpenTofu, AWS CLI, aws-vault, Granted, act, GitHub CLI |
| **AI & VibeCoding** | Claude Code, Ollama, aider, mods, fabric, LM Studio |
| **Shell Config & Dotfiles** | Optimized .zshrc, modern aliases, git delta config, trimmed p10k prompt |

## Script Generation

Generated scripts are OS-aware and smart about it:

- **macOS** — Homebrew batch installs, casks, curl installers, heredoc configs
- **Linux** — apt packages, snap, direct curl/wget installers
- **Windows** — PowerShell with winget, npm, and pip commands

Config tools generate full dotfile contents via heredocs with automatic backup of existing files.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion
- Lucide React
- GitHub Pages (static, no backend)

## Development

```bash
git clone https://github.com/mrlfarano/FoundTheGoodGood.git
cd FoundTheGoodGood
npm install
npm run dev
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions.

## License

MIT
