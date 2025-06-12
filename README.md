# 🆔 Identity Forge Wallet

A modern, decentralized identity wallet built with React and TypeScript. Create, manage, and share your self-sovereign digital identity with cryptographic security and AI-powered features.

![DID Wallet & Profile](https://img.shields.io/badge/DID-Wallet-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🔐 Decentralized Identity (DID) Management
- **One-Click DID Generation**: Create cryptographically secure decentralized identifiers
- **Self-Sovereign Identity**: Full control over your digital identity without intermediaries
- **Secure Key Management**: Browser-based cryptographic key generation and storage

### 👤 Profile Management
- **Rich Profiles**: Create detailed profiles with name, bio, email, and avatar
- **AI-Powered Avatars**: Generate personalized avatars using Google Gemini AI
- **Local Storage**: All data stored securely in your browser

### 🤝 Agent Handshakes & Connections
- **Secure Connections**: Establish cryptographic handshakes with other DIDs
- **Scoped Permissions**: Grant specific access permissions (calendar, contacts, documents, etc.)
- **Connection Management**: Track pending and accepted handshake requests
- **Real-time Status**: Monitor connection statuses and manage relationships

### 🤖 AI Agent Registry
- **Agent Registration**: Create and manage AI agents with specific capabilities
- **Capability Management**: Define agent abilities (text processing, image generation, data analysis, etc.)
- **Agent Chat**: Interactive chat interface with registered agents

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Glass Morphism**: Beautiful frosted glass effects and gradients
- **Smooth Animations**: Fluid transitions and hover effects
- **Dark Theme**: Eye-friendly dark interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebCrypto API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Uuuuu77/identity-forge-wallet.git
   cd identity-forge-wallet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and context
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Fast build tool and dev server

### UI Components & Styling
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Headless UI primitives
- **Tailwind CSS 3.4.11** - Utility-first styling
- **Lucide React** - Beautiful icons

### State Management & Data
- **React Context** - Global state management for DID and profile data
- **React Hook Form** - Form validation and management
- **Zod** - Schema validation

### AI Integration
- **Google Gemini API** - AI-powered avatar generation
- **Custom AI utilities** - Enhanced prompt engineering

### Cryptography
- **Web Crypto API** - Browser-native cryptographic operations
- **Custom crypto utilities** - DID generation and key management

## 📖 Usage Guide

### 1. Generate Your DID
1. Visit the **Dashboard** tab
2. Click "Generate My DID"
3. Your unique decentralized identifier will be created and displayed

### 2. Create Your Profile
1. Go to the **Profile** tab
2. Fill in your details (name, bio, email)
3. Optionally add a Gemini API key for AI avatar generation
4. Save your profile

### 3. Generate AI Avatar (Optional)
1. Add your Gemini API key in the Profile section
2. Enter your profile information
3. Click "Generate AI Avatar"
4. Your personalized avatar will be created

### 4. Establish Connections
1. Navigate to the **Handshakes** tab
2. Enter another user's DID
3. Select permission scope (calendar, contacts, etc.)
4. Send handshake request
5. Accept incoming handshake requests

### 5. Register AI Agents
1. Visit the **Agents** tab
2. Create agents with specific capabilities
3. Chat with your registered agents

## 🔧 Configuration

### Environment Variables
The application runs entirely client-side with no backend required. Configuration is managed through:

- **Local Storage**: DID, profile, and connection data
- **API Keys**: Gemini API key for AI features (stored locally)

### API Integration
To use AI avatar generation:
1. Get a Gemini API key from Google AI Studio
2. Enter the key in the Profile section
3. The key is stored locally in your browser

## 🏗️ Architecture

### Core Components
- **DIDContext**: Global state management for identity and connections
- **DIDDashboard**: DID generation and overview
- **ProfileEditor**: Profile creation and management
- **AgentHandshake**: Connection management system
- **AgentRegistry**: AI agent registration and chat

### Security Features
- **Client-side Cryptography**: All key generation happens in your browser
- **No Server Dependency**: Completely decentralized operation
- **Local Data Storage**: Your data never leaves your device
- **Cryptographic Handshakes**: Secure connection establishment

## 🛡️ Security & Privacy

- **Self-Sovereign**: You own and control your identity completely
- **Cryptographically Secured**: Advanced encryption protects your data
- **No Central Authority**: No servers or third parties involved
- **Local Storage Only**: All data remains on your device
- **Open Source**: Transparent, auditable code

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Roadmap

- [ ] **Enhanced Cryptography**: Implement proper Ed25519 signatures
- [ ] **Cross-Device Sync**: Secure synchronization across devices
- [ ] **Advanced Handshakes**: Multi-party and conditional handshakes
- [ ] **Plugin System**: Extensible architecture for custom features
- [ ] **Mobile App**: React Native implementation
- [ ] **Integration APIs**: Connect with external services and platforms

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Uuuuu77/identity-forge-wallet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Uuuuu77/identity-forge-wallet/discussions)
- **Email**: [Contact the maintainer](mailto:your-email@example.com)

## 🙏 Acknowledgments

- **Lovable**: Development platform and deployment
- **shadcn/ui**: Beautiful component library
- **Radix UI**: Accessible primitives
- **Google**: Gemini AI integration
- **The DID Community**: Standards and inspiration

---

**Built with ❤️ for a decentralized future**

*Your identity, your control, your choice.*
