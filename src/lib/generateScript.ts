import type { OS, Tool } from '../data/tools'

// ---------------------------------------------------------------------------
// Config file generators — produce heredoc blocks for the "Shell Config &
// Dotfiles" category.  They receive the full set of selected tool IDs so they
// can adapt content (e.g. only list OMZ plugins that the user also selected).
// ---------------------------------------------------------------------------

function generateZshrcConfig(selectedIds: Set<string>): string[] {
  // Build the OMZ plugins list. Always include the built-in ones; conditionally
  // include plugins that correspond to tools the user selected.
  const alwaysPlugins = ['git', 'docker', 'docker-compose', 'aws', 'gh', 'kubectl', 'terraform', 'direnv', 'fzf']
  const conditionalPlugins: { id: string; plugin: string }[] = [
    { id: 'zsh-autosuggestions', plugin: 'zsh-autosuggestions' },
    { id: 'zsh-syntax-highlighting', plugin: 'zsh-syntax-highlighting' },
  ]
  const extraPlugins = conditionalPlugins
    .filter(p => selectedIds.has(p.id))
    .map(p => p.plugin)
  // zsh-history-substring-search is bundled in the config regardless
  const plugins = [...alwaysPlugins, ...extraPlugins, 'zsh-history-substring-search']

  const lines: string[] = [
    '# ─────────────────────────────────────────────────────────',
    '# Optimized .zshrc',
    '# ─────────────────────────────────────────────────────────',
    'echo "📝 Writing optimized .zshrc..."',
    'if [ -f "$HOME/.zshrc" ]; then',
    '  cp "$HOME/.zshrc" "$HOME/.zshrc.bak.$(date +%s)"',
    '  echo "   ↳ backed up existing .zshrc"',
    'fi',
    '',
    "cat > \"$HOME/.zshrc\" << 'ZSHRC_EOF'",
    '# ──────────────────────────────────────────────────────',
    '# Powerlevel10k instant prompt (keep near top)',
    '# ──────────────────────────────────────────────────────',
    'if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then',
    '  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"',
    'fi',
    '',
    '# ──────────────────────────────────────────────────────',
    '# PATH — consolidated',
    '# ──────────────────────────────────────────────────────',
    'typeset -U path  # deduplicate',
    'path=(',
    '  $HOME/.local/bin',
    '  /opt/homebrew/bin',
    '  /usr/local/bin',
    '  $path',
    ')',
    'export PATH',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Oh My Zsh',
    '# ──────────────────────────────────────────────────────',
    'export ZSH="$HOME/.oh-my-zsh"',
    'ZSH_THEME="powerlevel10k/powerlevel10k"',
    '',
    `plugins=(${plugins.join(' ')})`,
    '',
    'source "$ZSH/oh-my-zsh.sh"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Lazy-loaded NVM (fast shell startup)',
    '# ──────────────────────────────────────────────────────',
    'export NVM_DIR="$HOME/.nvm"',
    'nvm() {',
    '  unfunction nvm',
    '  [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"',
    '  nvm "$@"',
    '}',
    'node() {',
    '  unfunction node',
    '  [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"',
    '  node "$@"',
    '}',
    'npm() {',
    '  unfunction npm',
    '  [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"',
    '  npm "$@"',
    '}',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Tool integrations',
    '# ──────────────────────────────────────────────────────',
    'command -v zoxide &>/dev/null && eval "$(zoxide init zsh)"',
    'command -v atuin  &>/dev/null && eval "$(atuin init zsh)"',
    'command -v direnv &>/dev/null && eval "$(direnv hook zsh)"',
    '[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh',
    '',
    '# ──────────────────────────────────────────────────────',
    '# iTerm2 shell integration',
    '# ──────────────────────────────────────────────────────',
    'test -e "${HOME}/.iterm2_shell_integration.zsh" && \\',
    '  source "${HOME}/.iterm2_shell_integration.zsh"',
    '',
    '# Source aliases if present',
    '[ -f "$HOME/.zshrc_aliases" ] && source "$HOME/.zshrc_aliases"',
    '',
    '# Powerlevel10k config',
    '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh',
    'ZSHRC_EOF',
    '',
  ]
  return lines
}

function generateAliasesConfig(): string[] {
  const lines: string[] = [
    '# ─────────────────────────────────────────────────────────',
    '# Modern Aliases (.zshrc_aliases)',
    '# ─────────────────────────────────────────────────────────',
    'echo "📝 Writing .zshrc_aliases..."',
    'if [ -f "$HOME/.zshrc_aliases" ]; then',
    '  cp "$HOME/.zshrc_aliases" "$HOME/.zshrc_aliases.bak.$(date +%s)"',
    '  echo "   ↳ backed up existing .zshrc_aliases"',
    'fi',
    '',
    "cat > \"$HOME/.zshrc_aliases\" << 'ALIASES_EOF'",
    '# ──────────────────────────────────────────────────────',
    '# Modern CLI replacements',
    '# ──────────────────────────────────────────────────────',
    'if command -v eza &>/dev/null; then',
    '  alias ls="eza --icons --group-directories-first"',
    '  alias ll="eza -alh --icons --group-directories-first --git"',
    '  alias lt="eza --tree --level=2 --icons"',
    '  alias la="eza -a --icons --group-directories-first"',
    'fi',
    '',
    'command -v bat  &>/dev/null && alias cat="bat --paging=never"',
    'command -v rg   &>/dev/null && alias grep="rg"',
    'command -v fd   &>/dev/null && alias find="fd"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# lazygit',
    '# ──────────────────────────────────────────────────────',
    'command -v lazygit &>/dev/null && alias lg="lazygit"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Git shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias gs="git status"',
    'alias gd="git diff"',
    'alias gl="git log --oneline --graph --decorate -15"',
    'alias gco="git checkout"',
    'alias gp="git push"',
    'alias gf="git fetch --all --prune"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Docker shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias dps="docker ps --format \'table {{.ID}}\\t{{.Names}}\\t{{.Status}}\\t{{.Ports}}\'"',
    'alias dcu="docker compose up -d"',
    'alias dcd="docker compose down"',
    'alias dcl="docker compose logs -f"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Kubernetes shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias k="kubectl"',
    'alias kns="kubectl config set-context --current --namespace"',
    'alias kctx="kubectl config use-context"',
    'alias kgp="kubectl get pods"',
    'alias kgs="kubectl get svc"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# AWS shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias awsw="aws sts get-caller-identity"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Terraform / OpenTofu shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias tf="terraform"',
    'alias tfi="terraform init"',
    'alias tfp="terraform plan"',
    'alias tfa="terraform apply"',
    '',
    '# ──────────────────────────────────────────────────────',
    '# Utility shortcuts',
    '# ──────────────────────────────────────────────────────',
    'alias serve="python3 -m http.server 8000"',
    'alias myip="curl -s ifconfig.me"',
    'alias flushdns="sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"',
    'alias ports="sudo lsof -iTCP -sTCP:LISTEN -n -P"',
    "alias path='echo $PATH | tr \":\" \"\\n\"'",
    'alias reload="exec zsh"',
    'ALIASES_EOF',
    '',
  ]
  return lines
}

function generateGitDeltaConfig(): string[] {
  const lines: string[] = [
    '# ─────────────────────────────────────────────────────────',
    '# Git Delta Config',
    '# ─────────────────────────────────────────────────────────',
    'echo "📝 Configuring git to use delta..."',
    'git config --global core.pager delta',
    "git config --global interactive.diffFilter 'delta --color-only'",
    'git config --global delta.navigate true',
    'git config --global delta.side-by-side true',
    'git config --global delta.line-numbers true',
    "git config --global delta.syntax-theme 'Dracula'",
    'git config --global merge.conflictstyle zdiff3',
    '',
  ]
  return lines
}

function generateP10kConfig(): string[] {
  const lines: string[] = [
    '# ─────────────────────────────────────────────────────────',
    '# Trimmed P10k right-prompt config',
    '# ─────────────────────────────────────────────────────────',
    'echo "📝 Writing trimmed .p10k.zsh right-prompt segments..."',
    'if [ -f "$HOME/.p10k.zsh" ]; then',
    '  cp "$HOME/.p10k.zsh" "$HOME/.p10k.zsh.bak.$(date +%s)"',
    '  echo "   ↳ backed up existing .p10k.zsh"',
    'fi',
    '',
    "cat > \"$HOME/.p10k.zsh\" << 'P10K_EOF'",
    "# Generated by FoundTheGoodGood — trimmed p10k config",
    "'builtin' 'local' '-a' 'p10k_config_opts'",
    "[[ ! -o 'aliases'         ]] || p10k_config_opts+=('aliases')",
    "[[ ! -o 'sh_glob'         ]] || p10k_config_opts+=('sh_glob')",
    "[[ ! -o 'no_brace_expand' ]] || p10k_config_opts+=('no_brace_expand')",
    "'builtin' 'setopt' 'no_aliases' 'no_sh_glob' 'brace_expand'",
    '',
    '() {',
    '  emulate -L zsh -o extended_glob',
    '',
    '  # Left prompt: directory and git info',
    '  typeset -g POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(',
    '    dir',
    '    vcs',
    '    newline',
    '    prompt_char',
    '  )',
    '',
    '  # Right prompt: curated segments only',
    '  typeset -g POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(',
    '    status',
    '    command_execution_time',
    '    background_jobs',
    '    direnv',
    '    virtualenv',
    '    pyenv',
    '    nvm',
    '    kubecontext',
    '    terraform',
    '    aws',
    '    context',
    '  )',
    '',
    '  # ── Visual tweaks ──────────────────────────────────',
    '  typeset -g POWERLEVEL9K_MODE=nerdfont-v3',
    '  typeset -g POWERLEVEL9K_PROMPT_ADD_NEWLINE=true',
    '  typeset -g POWERLEVEL9K_MULTILINE_FIRST_PROMPT_GAP_CHAR=" "',
    '  typeset -g POWERLEVEL9K_LEFT_PROMPT_FIRST_SEGMENT_START_SYMBOL=""',
    '  typeset -g POWERLEVEL9K_RIGHT_PROMPT_LAST_SEGMENT_END_SYMBOL=""',
    '',
    '  # ── Dir ────────────────────────────────────────────',
    '  typeset -g POWERLEVEL9K_DIR_FOREGROUND=31',
    '  typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique',
    '  typeset -g POWERLEVEL9K_SHORTEN_DELIMITER=".."',
    '',
    '  # ── VCS (Git) ─────────────────────────────────────',
    '  typeset -g POWERLEVEL9K_VCS_BRANCH_ICON=" "',
    '',
    '  # ── Command execution time ────────────────────────',
    '  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_THRESHOLD=3',
    '  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_FOREGROUND=101',
    '',
    '  # ── Kubecontext ───────────────────────────────────',
    '  typeset -g POWERLEVEL9K_KUBECONTEXT_SHOW_ON_COMMAND="kubectl|helm|kubens|kubectx|oc|istioctl|kogito|k9s|helmfile|flux|fluxctl|stern|kubeseal|skaffold|kubent|kubelogin|conduit"',
    '',
    '  # ── AWS ────────────────────────────────────────────',
    '  typeset -g POWERLEVEL9K_AWS_SHOW_ON_COMMAND="aws|awless|cdk|terraform|pulumi|terragrunt"',
    '',
    '  # ── Terraform ─────────────────────────────────────',
    '  typeset -g POWERLEVEL9K_TERRAFORM_SHOW_ON_COMMAND="terraform|tf|tofu"',
    '',
    '  # ── Transient prompt ──────────────────────────────',
    '  typeset -g POWERLEVEL9K_TRANSIENT_PROMPT=off',
    '',
    '  # ── Instant prompt ────────────────────────────────',
    '  typeset -g POWERLEVEL9K_INSTANT_PROMPT=verbose',
    '}',
    '',
    "(( ${#p10k_config_opts} )) && setopt ${p10k_config_opts[@]}",
    "'builtin' 'unset' 'p10k_config_opts'",
    'P10K_EOF',
    '',
  ]
  return lines
}

/** Map config tool IDs to their generator functions */
function generateConfigLines(
  toolId: string,
  selectedIds: Set<string>,
): string[] {
  switch (toolId) {
    case 'optimized-zshrc':
      return generateZshrcConfig(selectedIds)
    case 'modern-aliases':
      return generateAliasesConfig()
    case 'git-delta-config':
      return generateGitDeltaConfig()
    case 'trimmed-p10k':
      return generateP10kConfig()
    default:
      return []
  }
}

function generateMacOSScript(tools: Tool[]): string {
  const selectedIds = new Set(tools.map(t => t.id))

  // Separate config tools from installable tools
  const configTools = tools.filter(t => t.isConfig)
  const installTools = tools.filter(t => !t.isConfig)

  const lines: string[] = [
    '#!/bin/bash',
    '# ═══════════════════════════════════════════════════════════',
    '# FoundTheGoodGood — macOS Install Script',
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    `# Tools: ${tools.map(t => t.name).join(', ')}`,
    '# ═══════════════════════════════════════════════════════════',
    '',
    'set -e',
    '',
    'echo "🚀 Starting FoundTheGoodGood installation..."',
    'echo ""',
  ]

  // --- installable tools (unchanged logic) ---
  // Check for Homebrew first
  const hasHomebrew = installTools.some(t => t.id === 'homebrew')
  const brewTools = installTools.filter(t => {
    if (t.id === 'homebrew') return false
    const cmd = t.install.macos ?? ''
    return cmd.startsWith('brew install') || cmd.startsWith('brew install --cask')
  })

  const nonBrewTools = installTools.filter(t => {
    if (t.id === 'homebrew') return false
    const cmd = t.install.macos ?? ''
    return !cmd.startsWith('brew install')
  })

  if (installTools.length > 0) {
    if (hasHomebrew) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# Homebrew')
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('echo "📦 Installing Homebrew..."')
      lines.push('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"')
      lines.push('')
    } else if (brewTools.length > 0) {
      lines.push('# Check for Homebrew')
      lines.push('if ! command -v brew &>/dev/null; then')
      lines.push('  echo "⚠️  Homebrew not found. Install it first: https://brew.sh"')
      lines.push('  echo "   /bin/bash -c \\"\\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\\""')
      lines.push('fi')
      lines.push('')
    }

    // Group brew tools
    const plainBrewInstalls = brewTools.filter(t => {
      const cmd = t.install.macos ?? ''
      return cmd === `brew install ${cmd.replace('brew install ', '')}` && !cmd.includes('--cask') && !cmd.includes('/')
    })

    const specialBrewInstalls = brewTools.filter(t => {
      const cmd = t.install.macos ?? ''
      return cmd.includes('--cask') || cmd.includes('/')
    })

    if (plainBrewInstalls.length > 0) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# Homebrew packages')
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('echo "🍺 Installing Homebrew packages..."')
      const packages = plainBrewInstalls.map(t => (t.install.macos ?? '').replace('brew install ', ''))
      lines.push(`brew install ${packages.join(' \\\n  ')}`)
      lines.push('')
    }

    if (specialBrewInstalls.length > 0) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# Homebrew casks & taps')
      lines.push('# ─────────────────────────────────────────────────────────')
      for (const tool of specialBrewInstalls) {
        lines.push(`echo "📥 Installing ${tool.name}..."`)
        lines.push(tool.install.macos ?? '')
      }
      lines.push('')
    }

    if (nonBrewTools.length > 0) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# Direct installers')
      lines.push('# ─────────────────────────────────────────────────────────')
      for (const tool of nonBrewTools) {
        const cmd = tool.install.macos
        if (!cmd) continue
        lines.push(`echo "📥 Installing ${tool.name}..."`)
        lines.push(cmd)
        lines.push('')
      }
    }
  }

  // --- config / dotfiles section ---
  if (configTools.length > 0) {
    lines.push('')
    lines.push('# ═══════════════════════════════════════════════════════════')
    lines.push('# Shell Config & Dotfiles')
    lines.push('# ═══════════════════════════════════════════════════════════')
    lines.push('')
    for (const tool of configTools) {
      lines.push(...generateConfigLines(tool.id, selectedIds))
    }
  }

  lines.push('echo ""')
  lines.push('echo "✅ Done! Your dev environment is ready."')
  lines.push('echo "💡 You may need to restart your terminal for some changes to take effect."')

  return lines.join('\n')
}

function generateLinuxScript(tools: Tool[]): string {
  const selectedIds = new Set(tools.map(t => t.id))
  const configTools = tools.filter(t => t.isConfig)
  const installTools = tools.filter(t => !t.isConfig)

  const lines: string[] = [
    '#!/bin/bash',
    '# ═══════════════════════════════════════════════════════════',
    '# FoundTheGoodGood — Linux Install Script',
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    `# Tools: ${tools.map(t => t.name).join(', ')}`,
    '# ═══════════════════════════════════════════════════════════',
    '',
    'set -e',
    '',
    '# Detect distro',
    'if [ -f /etc/os-release ]; then',
    '  . /etc/os-release',
    '  DISTRO=$ID',
    'else',
    '  DISTRO="unknown"',
    'fi',
    '',
    'echo "🚀 Starting FoundTheGoodGood installation on $DISTRO..."',
    'echo ""',
    '',
  ]

  if (installTools.length > 0) {
    lines.push('# Update package list')
    lines.push('echo "🔄 Updating package lists..."')
    lines.push('sudo apt-get update -qq')
    lines.push('')

    const aptTools = installTools.filter(t => {
      const cmd = t.install.linux ?? ''
      return cmd.startsWith('sudo apt-get install') && !cmd.includes('&&')
    })

    const otherTools = installTools.filter(t => {
      const cmd = t.install.linux ?? ''
      return !(cmd.startsWith('sudo apt-get install') && !cmd.includes('&&'))
    })

    if (aptTools.length > 0) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# APT packages')
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('echo "📦 Installing APT packages..."')
      const packages = aptTools.map(t => (t.install.linux ?? '').replace('sudo apt-get install -y ', ''))
      lines.push(`sudo apt-get install -y ${packages.join(' \\\n  ')}`)
      lines.push('')
    }

    if (otherTools.length > 0) {
      lines.push('# ─────────────────────────────────────────────────────────')
      lines.push('# Direct installers & other package managers')
      lines.push('# ─────────────────────────────────────────────────────────')
      for (const tool of otherTools) {
        const cmd = tool.install.linux
        if (!cmd) continue
        lines.push(`echo "📥 Installing ${tool.name}..."`)
        lines.push(cmd)
        lines.push('')
      }
    }
  }

  // --- config / dotfiles section ---
  if (configTools.length > 0) {
    lines.push('')
    lines.push('# ═══════════════════════════════════════════════════════════')
    lines.push('# Shell Config & Dotfiles')
    lines.push('# ═══════════════════════════════════════════════════════════')
    lines.push('')
    for (const tool of configTools) {
      lines.push(...generateConfigLines(tool.id, selectedIds))
    }
  }

  lines.push('echo ""')
  lines.push('echo "✅ Done! Your dev environment is ready."')
  lines.push('echo "💡 You may need to restart your terminal for some changes to take effect."')

  return lines.join('\n')
}

function generateWindowsScript(tools: Tool[]): string {
  const lines: string[] = [
    '#Requires -Version 5.1',
    '<#',
    '.SYNOPSIS',
    '  FoundTheGoodGood — Windows Install Script',
    `  Generated: ${new Date().toISOString().split('T')[0]}`,
    `  Tools: ${tools.map(t => t.name).join(', ')}`,
    '#>',
    '',
    '$ErrorActionPreference = "Stop"',
    '',
    'Write-Host "🚀 Starting FoundTheGoodGood installation..." -ForegroundColor Cyan',
    'Write-Host ""',
    '',
    '# Check for winget',
    'if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {',
    '  Write-Host "❌ winget not found. Install App Installer from the Microsoft Store." -ForegroundColor Red',
    '  Start-Process "ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1"',
    '  exit 1',
    '}',
    '',
    '# Check for npm (for npm-based installs)',
    'function Test-NodeNpm {',
    '  return (Get-Command npm -ErrorAction SilentlyContinue) -ne $null',
    '}',
    '',
  ]

  const wingetTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('winget install')
  })

  const npmTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('npm install')
  })

  const pipTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return cmd.startsWith('pip install')
  })

  // Anything self-contained that isn't a winget/npm/pip one-liner (curl
  // installers, scoop, Invoke-WebRequest scripts…). Emitted verbatim instead
  // of being silently dropped.
  const otherTools = tools.filter(t => {
    const cmd = t.install.windows ?? ''
    return (
      !cmd.startsWith('winget install') &&
      !cmd.startsWith('npm install') &&
      !cmd.startsWith('pip install')
    )
  })

  if (wingetTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Winget packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of wingetTools) {
      lines.push(`Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(`${tool.install.windows} --silent --accept-package-agreements --accept-source-agreements`)
    }
    lines.push('')
  }

  if (npmTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# NPM global packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('if (Test-NodeNpm) {')
    for (const tool of npmTools) {
      lines.push(`  Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(`  ${tool.install.windows}`)
    }
    lines.push('} else {')
    lines.push('  Write-Host "⚠️  npm not found — skipping npm packages. Install Node.js first." -ForegroundColor Yellow')
    lines.push('}')
    lines.push('')
  }

  if (pipTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Python packages')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of pipTools) {
      lines.push(`Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(tool.install.windows ?? '')
    }
    lines.push('')
  }

  if (otherTools.length > 0) {
    lines.push('# ─────────────────────────────────────────────────────────')
    lines.push('# Custom installers (curl scripts, scoop, etc.)')
    lines.push('# ─────────────────────────────────────────────────────────')
    for (const tool of otherTools) {
      lines.push(`Write-Host "📥 Installing ${tool.name}..." -ForegroundColor Blue`)
      lines.push(tool.install.windows ?? '')
    }
    lines.push('')
  }

  lines.push('Write-Host ""')
  lines.push('Write-Host "✅ Done! Your dev environment is ready." -ForegroundColor Green')
  lines.push('Write-Host "💡 You may need to restart your terminal for some changes to take effect." -ForegroundColor Yellow')

  return lines.join('\n')
}

export function generateScript(tools: Tool[], os: OS): string {
  if (tools.length === 0) return ''
  // For macOS/Linux, config tools are available; for Windows they are null so
  // they'll be filtered out by the availability check already.
  const availableTools = tools.filter(t => t.install[os] !== null)
  if (availableTools.length === 0) return ''

  if (os === 'macos') return generateMacOSScript(availableTools)
  if (os === 'linux') return generateLinuxScript(availableTools)
  return generateWindowsScript(availableTools)
}
