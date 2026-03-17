export type OS = 'macos' | 'linux' | 'windows'

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  install: {
    macos: string | null
    linux: string | null
    windows: string | null
  }
  /** When true, the script generator uses generateConfigScript() instead of the install command */
  isConfig?: boolean
  links: {
    homepage: string
    github?: string
  }
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'shell',
    name: 'Shell & Terminal',
    icon: 'Terminal',
    description: 'Supercharge your shell experience',
  },
  {
    id: 'cli',
    name: 'CLI Essentials',
    icon: 'Zap',
    description: 'Modern replacements for classic Unix tools',
  },
  {
    id: 'runtimes',
    name: 'Dev Runtimes',
    icon: 'Code2',
    description: 'Version managers and language runtimes',
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: 'Cloud',
    description: 'Kubernetes, Terraform, and cloud tooling',
  },
  {
    id: 'ai',
    name: 'AI & VibeCoding',
    icon: 'Sparkles',
    description: 'AI-powered development tools',
  },
  {
    id: 'dotfiles',
    name: 'Shell Config & Dotfiles',
    icon: 'Settings',
    description: 'Generate optimized shell configs, aliases, and dotfiles',
  },
]

export const TOOLS: Tool[] = [
  // Shell & Terminal
  {
    id: 'ohmyzsh',
    name: 'Oh My Zsh',
    description: 'The community-driven framework for managing your zsh configuration. Thousands of plugins and themes.',
    category: 'shell',
    tags: ['zsh', 'shell', 'terminal', 'productivity'],
    install: {
      macos: 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
      linux: 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
      windows: null,
    },
    links: {
      homepage: 'https://ohmyz.sh',
      github: 'https://github.com/ohmyzsh/ohmyzsh',
    },
  },
  {
    id: 'powerlevel10k',
    name: 'Powerlevel10k',
    description: 'A blazing fast, highly customizable Zsh theme with a beautiful configuration wizard.',
    category: 'shell',
    tags: ['zsh', 'theme', 'prompt', 'terminal'],
    install: {
      macos: 'git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k',
      linux: 'git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/romkatv/powerlevel10k',
      github: 'https://github.com/romkatv/powerlevel10k',
    },
  },
  {
    id: 'zsh-autosuggestions',
    name: 'zsh-autosuggestions',
    description: 'Fish-like autosuggestions for zsh — suggests commands as you type based on history.',
    category: 'shell',
    tags: ['zsh', 'shell', 'autocomplete', 'productivity'],
    install: {
      macos: 'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions',
      linux: 'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/zsh-users/zsh-autosuggestions',
      github: 'https://github.com/zsh-users/zsh-autosuggestions',
    },
  },
  {
    id: 'zsh-syntax-highlighting',
    name: 'zsh-syntax-highlighting',
    description: 'Fish shell-like syntax highlighting for Zsh. Commands are highlighted as you type.',
    category: 'shell',
    tags: ['zsh', 'shell', 'syntax', 'highlight'],
    install: {
      macos: 'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting',
      linux: 'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/zsh-users/zsh-syntax-highlighting',
      github: 'https://github.com/zsh-users/zsh-syntax-highlighting',
    },
  },
  {
    id: 'starship',
    name: 'Starship',
    description: 'The minimal, blazing-fast, and infinitely customizable prompt for any shell.',
    category: 'shell',
    tags: ['prompt', 'shell', 'terminal', 'cross-platform'],
    install: {
      macos: 'brew install starship',
      linux: 'curl -sS https://starship.rs/install.sh | sh',
      windows: 'winget install --id Starship.Starship',
    },
    links: {
      homepage: 'https://starship.rs',
      github: 'https://github.com/starship/starship',
    },
  },
  {
    id: 'atuin',
    name: 'Atuin',
    description: 'Magical shell history — sync, search, and backup your terminal history across machines.',
    category: 'shell',
    tags: ['history', 'shell', 'sync', 'search', 'productivity'],
    install: {
      macos: 'bash <(curl https://raw.githubusercontent.com/atuinsh/atuin/main/install.sh)',
      linux: 'bash <(curl https://raw.githubusercontent.com/atuinsh/atuin/main/install.sh)',
      windows: 'winget install --id Atuin.Atuin',
    },
    links: {
      homepage: 'https://atuin.sh',
      github: 'https://github.com/atuinsh/atuin',
    },
  },
  {
    id: 'zoxide',
    name: 'Zoxide',
    description: 'A smarter cd command that learns your habits and lets you jump to directories fast.',
    category: 'shell',
    tags: ['navigation', 'shell', 'cd', 'productivity'],
    install: {
      macos: 'brew install zoxide',
      linux: 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh',
      windows: 'winget install --id ajeetdsouza.zoxide',
    },
    links: {
      homepage: 'https://github.com/ajeetdsouza/zoxide',
      github: 'https://github.com/ajeetdsouza/zoxide',
    },
  },

  // CLI Essentials
  {
    id: 'fzf',
    name: 'fzf',
    description: 'A command-line fuzzy finder. Works with any list — files, command history, git branches.',
    category: 'cli',
    tags: ['fuzzy', 'search', 'filter', 'productivity'],
    install: {
      macos: 'brew install fzf',
      linux: 'sudo apt-get install -y fzf',
      windows: 'winget install --id junegunn.fzf',
    },
    links: {
      homepage: 'https://github.com/junegunn/fzf',
      github: 'https://github.com/junegunn/fzf',
    },
  },
  {
    id: 'bat',
    name: 'bat',
    description: 'A cat clone with syntax highlighting, line numbers, and git integration.',
    category: 'cli',
    tags: ['cat', 'syntax', 'highlight', 'files'],
    install: {
      macos: 'brew install bat',
      linux: 'sudo apt-get install -y bat',
      windows: 'winget install --id sharkdp.bat',
    },
    links: {
      homepage: 'https://github.com/sharkdp/bat',
      github: 'https://github.com/sharkdp/bat',
    },
  },
  {
    id: 'eza',
    name: 'eza',
    description: 'A modern replacement for ls with colors, icons, and git integration.',
    category: 'cli',
    tags: ['ls', 'files', 'directory', 'listing'],
    install: {
      macos: 'brew install eza',
      linux: 'sudo apt-get install -y eza',
      windows: 'winget install --id eza-community.eza',
    },
    links: {
      homepage: 'https://eza.rocks',
      github: 'https://github.com/eza-community/eza',
    },
  },
  {
    id: 'fd',
    name: 'fd',
    description: 'A simple, fast and user-friendly alternative to find. Sensible defaults, colorized output.',
    category: 'cli',
    tags: ['find', 'search', 'files', 'fast'],
    install: {
      macos: 'brew install fd',
      linux: 'sudo apt-get install -y fd-find',
      windows: 'winget install --id sharkdp.fd',
    },
    links: {
      homepage: 'https://github.com/sharkdp/fd',
      github: 'https://github.com/sharkdp/fd',
    },
  },
  {
    id: 'ripgrep',
    name: 'ripgrep',
    description: 'An extremely fast alternative to grep that respects gitignore and searches recursively.',
    category: 'cli',
    tags: ['grep', 'search', 'text', 'fast'],
    install: {
      macos: 'brew install ripgrep',
      linux: 'sudo apt-get install -y ripgrep',
      windows: 'winget install --id BurntSushi.ripgrep.MSVC',
    },
    links: {
      homepage: 'https://github.com/BurntSushi/ripgrep',
      github: 'https://github.com/BurntSushi/ripgrep',
    },
  },
  {
    id: 'delta',
    name: 'delta',
    description: 'A syntax-highlighting pager for git, diff, and grep output. Beautiful diffs.',
    category: 'cli',
    tags: ['git', 'diff', 'syntax', 'highlight'],
    install: {
      macos: 'brew install git-delta',
      linux: 'sudo apt-get install -y git-delta',
      windows: 'winget install --id dandavison.delta',
    },
    links: {
      homepage: 'https://dandavison.github.io/delta',
      github: 'https://github.com/dandavison/delta',
    },
  },
  {
    id: 'jq',
    name: 'jq',
    description: 'A lightweight and flexible command-line JSON processor. The awk of JSON.',
    category: 'cli',
    tags: ['json', 'processor', 'filter', 'data'],
    install: {
      macos: 'brew install jq',
      linux: 'sudo apt-get install -y jq',
      windows: 'winget install --id jqlang.jq',
    },
    links: {
      homepage: 'https://jqlang.github.io/jq',
      github: 'https://github.com/jqlang/jq',
    },
  },
  {
    id: 'direnv',
    name: 'direnv',
    description: 'Automatically load and unload environment variables based on the current directory.',
    category: 'cli',
    tags: ['env', 'environment', 'shell', 'dotenv'],
    install: {
      macos: 'brew install direnv',
      linux: 'sudo apt-get install -y direnv',
      windows: null,
    },
    links: {
      homepage: 'https://direnv.net',
      github: 'https://github.com/direnv/direnv',
    },
  },
  {
    id: 'lazygit',
    name: 'lazygit',
    description: 'A simple terminal UI for git commands. Stage hunks, rebase interactively, resolve conflicts.',
    category: 'cli',
    tags: ['git', 'tui', 'terminal', 'productivity'],
    install: {
      macos: 'brew install lazygit',
      linux: 'sudo add-apt-repository ppa:lazygit-team/release && sudo apt-get update && sudo apt-get install -y lazygit',
      windows: 'winget install --id JesseDuffield.lazygit',
    },
    links: {
      homepage: 'https://github.com/jesseduffield/lazygit',
      github: 'https://github.com/jesseduffield/lazygit',
    },
  },

  // Dev Runtimes
  {
    id: 'homebrew',
    name: 'Homebrew',
    description: 'The missing package manager for macOS (and Linux). Install the tools Apple didn\'t.',
    category: 'runtimes',
    tags: ['package-manager', 'macos', 'install'],
    install: {
      macos: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      linux: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      windows: null,
    },
    links: {
      homepage: 'https://brew.sh',
      github: 'https://github.com/Homebrew/brew',
    },
  },
  {
    id: 'pyenv',
    name: 'pyenv',
    description: 'Simple Python version management. Switch between Python versions per-project.',
    category: 'runtimes',
    tags: ['python', 'version-manager', 'runtime'],
    install: {
      macos: 'brew install pyenv',
      linux: 'curl https://pyenv.run | bash',
      windows: 'winget install --id pyenv-win.pyenv-win',
    },
    links: {
      homepage: 'https://github.com/pyenv/pyenv',
      github: 'https://github.com/pyenv/pyenv',
    },
  },
  {
    id: 'nvm',
    name: 'nvm',
    description: 'Node Version Manager — install, switch, and manage multiple Node.js versions.',
    category: 'runtimes',
    tags: ['node', 'nodejs', 'version-manager', 'javascript'],
    install: {
      macos: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash',
      linux: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash',
      windows: 'winget install --id CoreyButler.NVMforWindows',
    },
    links: {
      homepage: 'https://github.com/nvm-sh/nvm',
      github: 'https://github.com/nvm-sh/nvm',
    },
  },
  {
    id: 'mise',
    name: 'mise',
    description: 'The universal version manager — one tool to manage Node, Python, Ruby, Go, and more.',
    category: 'runtimes',
    tags: ['version-manager', 'node', 'python', 'ruby', 'universal'],
    install: {
      macos: 'brew install mise',
      linux: 'curl https://mise.run | sh',
      windows: 'winget install --id jdx.mise',
    },
    links: {
      homepage: 'https://mise.jdx.dev',
      github: 'https://github.com/jdx/mise',
    },
  },

  // DevOps & Cloud
  {
    id: 'docker',
    name: 'Docker Desktop',
    description: 'The complete Docker development environment with GUI, including Docker Engine and Compose.',
    category: 'devops',
    tags: ['docker', 'containers', 'devops', 'virtualization'],
    install: {
      macos: 'brew install --cask docker',
      linux: 'curl -fsSL https://get.docker.com | sh',
      windows: 'winget install --id Docker.DockerDesktop',
    },
    links: {
      homepage: 'https://www.docker.com/products/docker-desktop',
      github: 'https://github.com/docker',
    },
  },
  {
    id: 'kubectl',
    name: 'kubectl',
    description: 'The Kubernetes command-line tool. Deploy and manage applications on a Kubernetes cluster.',
    category: 'devops',
    tags: ['kubernetes', 'k8s', 'devops', 'cloud'],
    install: {
      macos: 'brew install kubectl',
      linux: 'sudo apt-get install -y kubectl',
      windows: 'winget install --id Kubernetes.kubectl',
    },
    links: {
      homepage: 'https://kubernetes.io/docs/reference/kubectl',
      github: 'https://github.com/kubernetes/kubectl',
    },
  },
  {
    id: 'k9s',
    name: 'k9s',
    description: 'A terminal-based UI to manage Kubernetes clusters. Navigate resources, view logs, exec into pods.',
    category: 'devops',
    tags: ['kubernetes', 'k8s', 'tui', 'devops'],
    install: {
      macos: 'brew install k9s',
      linux: 'sudo snap install k9s',
      windows: 'winget install --id derailed.k9s',
    },
    links: {
      homepage: 'https://k9scli.io',
      github: 'https://github.com/derailed/k9s',
    },
  },
  {
    id: 'helm',
    name: 'Helm',
    description: 'The package manager for Kubernetes. Deploy complex applications with a single command.',
    category: 'devops',
    tags: ['kubernetes', 'k8s', 'package-manager', 'devops'],
    install: {
      macos: 'brew install helm',
      linux: 'curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash',
      windows: 'winget install --id Helm.Helm',
    },
    links: {
      homepage: 'https://helm.sh',
      github: 'https://github.com/helm/helm',
    },
  },
  {
    id: 'opentofu',
    name: 'OpenTofu',
    description: 'The open-source Terraform fork. Infrastructure as code for any cloud provider.',
    category: 'devops',
    tags: ['terraform', 'iac', 'infrastructure', 'cloud'],
    install: {
      macos: 'brew install opentofu',
      linux: 'sudo snap install --classic opentofu',
      windows: 'winget install --id OpenTOFU.OpenTOFU',
    },
    links: {
      homepage: 'https://opentofu.org',
      github: 'https://github.com/opentofu/opentofu',
    },
  },
  {
    id: 'tfswitch',
    name: 'tfswitch',
    description: 'Switch between Terraform and OpenTofu versions effortlessly. Perfect for multi-project work.',
    category: 'devops',
    tags: ['terraform', 'version-manager', 'iac'],
    install: {
      macos: 'brew install warrensbox/tap/tfswitch',
      linux: 'curl -L https://raw.githubusercontent.com/warrensbox/terraform-switcher/release/install.sh | bash',
      windows: null,
    },
    links: {
      homepage: 'https://tfswitch.warrensbox.com',
      github: 'https://github.com/warrensbox/terraform-switcher',
    },
  },
  {
    id: 'awscli',
    name: 'AWS CLI',
    description: 'The official command-line interface for Amazon Web Services. Manage all AWS services.',
    category: 'devops',
    tags: ['aws', 'cloud', 'cli', 'amazon'],
    install: {
      macos: 'brew install awscli',
      linux: 'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install',
      windows: 'winget install --id Amazon.AWSCLI',
    },
    links: {
      homepage: 'https://aws.amazon.com/cli',
      github: 'https://github.com/aws/aws-cli',
    },
  },
  {
    id: 'aws-vault',
    name: 'aws-vault',
    description: 'Securely store and access AWS credentials in your development environment.',
    category: 'devops',
    tags: ['aws', 'security', 'credentials', 'vault'],
    install: {
      macos: 'brew install --cask aws-vault',
      linux: 'sudo snap install aws-vault',
      windows: 'winget install --id 99designs.aws-vault',
    },
    links: {
      homepage: 'https://github.com/99designs/aws-vault',
      github: 'https://github.com/99designs/aws-vault',
    },
  },
  {
    id: 'granted',
    name: 'Granted',
    description: 'Assume AWS IAM roles and open multiple AWS accounts in your browser simultaneously.',
    category: 'devops',
    tags: ['aws', 'sso', 'iam', 'multi-account'],
    install: {
      macos: 'brew install common-fate/granted/granted',
      linux: 'brew install common-fate/granted/granted',
      windows: null,
    },
    links: {
      homepage: 'https://granted.dev',
      github: 'https://github.com/common-fate/granted',
    },
  },
  {
    id: 'act',
    name: 'act',
    description: 'Run your GitHub Actions locally. Test your CI/CD pipeline without pushing to GitHub.',
    category: 'devops',
    tags: ['github-actions', 'ci', 'cd', 'local', 'testing'],
    install: {
      macos: 'brew install act',
      linux: 'curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash',
      windows: 'winget install --id nektos.act',
    },
    links: {
      homepage: 'https://nektosact.com',
      github: 'https://github.com/nektos/act',
    },
  },
  {
    id: 'gh',
    name: 'GitHub CLI',
    description: 'Work with GitHub from the terminal — PRs, issues, releases, actions, and more.',
    category: 'devops',
    tags: ['github', 'git', 'pr', 'cli'],
    install: {
      macos: 'brew install gh',
      linux: 'sudo apt-get install -y gh',
      windows: 'winget install --id GitHub.cli',
    },
    links: {
      homepage: 'https://cli.github.com',
      github: 'https://github.com/cli/cli',
    },
  },

  // AI & VibeCoding
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Anthropic\'s official CLI for Claude — your AI pair programmer that understands your codebase.',
    category: 'ai',
    tags: ['ai', 'claude', 'anthropic', 'cli', 'pair-programming'],
    install: {
      macos: 'npm install -g @anthropic-ai/claude-code',
      linux: 'npm install -g @anthropic-ai/claude-code',
      windows: 'npm install -g @anthropic-ai/claude-code',
    },
    links: {
      homepage: 'https://claude.ai/code',
      github: 'https://github.com/anthropics/claude-code',
    },
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run large language models locally. Llama, Mistral, Gemma, and more. No cloud required.',
    category: 'ai',
    tags: ['ai', 'llm', 'local', 'llama', 'offline'],
    install: {
      macos: 'brew install ollama',
      linux: 'curl -fsSL https://ollama.com/install.sh | sh',
      windows: 'winget install --id Ollama.Ollama',
    },
    links: {
      homepage: 'https://ollama.com',
      github: 'https://github.com/ollama/ollama',
    },
  },
  {
    id: 'aider',
    name: 'aider',
    description: 'AI pair programming in your terminal. Code with Claude or GPT-4 directly in your editor.',
    category: 'ai',
    tags: ['ai', 'pair-programming', 'gpt', 'claude', 'coding'],
    install: {
      macos: 'pip install aider-chat',
      linux: 'pip install aider-chat',
      windows: 'pip install aider-chat',
    },
    links: {
      homepage: 'https://aider.chat',
      github: 'https://github.com/paul-gauthier/aider',
    },
  },
  {
    id: 'mods',
    name: 'mods',
    description: 'AI on the command line. Pipe text to LLMs directly from your terminal. Supports OpenAI, Claude, and local models.',
    category: 'ai',
    tags: ['ai', 'cli', 'pipe', 'llm', 'gpt'],
    install: {
      macos: 'brew install charmbracelet/tap/mods',
      linux: 'sudo snap install mods',
      windows: 'winget install --id charmbracelet.mods',
    },
    links: {
      homepage: 'https://github.com/charmbracelet/mods',
      github: 'https://github.com/charmbracelet/mods',
    },
  },
  {
    id: 'fabric',
    name: 'fabric',
    description: 'An open-source framework for augmenting humans using AI. A collection of useful AI patterns.',
    category: 'ai',
    tags: ['ai', 'patterns', 'productivity', 'llm'],
    install: {
      macos: 'pip install fabric-ai',
      linux: 'pip install fabric-ai',
      windows: 'pip install fabric-ai',
    },
    links: {
      homepage: 'https://github.com/danielmiessler/fabric',
      github: 'https://github.com/danielmiessler/fabric',
    },
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    description: 'Discover, download, and run local LLMs with a beautiful desktop app. OpenAI-compatible server.',
    category: 'ai',
    tags: ['ai', 'llm', 'local', 'desktop', 'gui'],
    install: {
      macos: 'brew install --cask lm-studio',
      linux: 'curl -fsSL https://releases.lmstudio.ai/linux/x86/0.3.5/latest/LM_Studio-0.3.5.AppImage -o LM_Studio.AppImage && chmod +x LM_Studio.AppImage',
      windows: 'winget install --id ElementLabs.LMStudio',
    },
    links: {
      homepage: 'https://lmstudio.ai',
    },
  },

  // Shell Config & Dotfiles
  {
    id: 'optimized-zshrc',
    name: 'Optimized .zshrc',
    description: 'A clean .zshrc with Powerlevel10k instant prompt, consolidated PATH exports, OMZ plugins, lazy-loaded NVM, and tool integrations.',
    category: 'dotfiles',
    tags: ['zsh', 'dotfiles', 'config', 'shell', 'omz'],
    isConfig: true,
    install: {
      macos: '__CONFIG_ZSHRC__',
      linux: '__CONFIG_ZSHRC__',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/ohmyzsh/ohmyzsh',
    },
  },
  {
    id: 'modern-aliases',
    name: 'Modern Aliases',
    description: 'A .zshrc_aliases file with modern tool aliases — eza for ls, bat for cat, ripgrep for grep, plus git, docker, k8s, and terraform shortcuts.',
    category: 'dotfiles',
    tags: ['aliases', 'dotfiles', 'shell', 'productivity'],
    isConfig: true,
    install: {
      macos: '__CONFIG_ALIASES__',
      linux: '__CONFIG_ALIASES__',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/ohmyzsh/ohmyzsh/wiki/Cheatsheet',
    },
  },
  {
    id: 'git-delta-config',
    name: 'Git Delta Config',
    description: 'Configure git to use delta for beautiful syntax-highlighted diffs with side-by-side view, line numbers, and Dracula theme.',
    category: 'dotfiles',
    tags: ['git', 'delta', 'diff', 'config'],
    isConfig: true,
    install: {
      macos: '__CONFIG_GIT_DELTA__',
      linux: '__CONFIG_GIT_DELTA__',
      windows: null,
    },
    links: {
      homepage: 'https://dandavison.github.io/delta',
      github: 'https://github.com/dandavison/delta',
    },
  },
  {
    id: 'trimmed-p10k',
    name: 'Trimmed P10k Config',
    description: 'A Powerlevel10k right-prompt config with only relevant segments: status, exec time, jobs, direnv, virtualenv, pyenv, nvm, k8s, terraform, aws, context.',
    category: 'dotfiles',
    tags: ['p10k', 'powerlevel10k', 'prompt', 'config'],
    isConfig: true,
    install: {
      macos: '__CONFIG_P10K__',
      linux: '__CONFIG_P10K__',
      windows: null,
    },
    links: {
      homepage: 'https://github.com/romkatv/powerlevel10k',
      github: 'https://github.com/romkatv/powerlevel10k',
    },
  },
]
