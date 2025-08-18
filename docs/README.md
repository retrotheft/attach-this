# Attach This Documentation

Welcome to the attach-this documentation! This library provides ergonomic everyday helpers for Svelte 5 built on the powerful attachment system.

## 📚 Documentation Structure

### Core Modules
- **[Hoverable Dollar Store](./hoverable.md)** - Reactive hover state management
- **[DND Core](./dnd-core.md)** - Modular drag and drop system
- **[Ghost Middleware](./ghost-middleware.md)** - Custom drag images
- **[Validation Middleware](./validation-middleware.md)** - Drop zone validation

### Guides
- **[Getting Started](./getting-started.md)** - Installation and basic usage
- **[API Reference](./api-reference.md)** - Complete API documentation
- **[Examples](./examples.md)** - Real-world usage patterns
- **[Migration Guide](./migration.md)** - Upgrading from previous versions

## 🚀 Quick Links

### Installation
```bash
npm install attach-this
```

### Basic Usage
```svelte
<script>
   import { hoverable, createDnd } from 'attach-this'
   
   const dnd = createDnd()
   const itemData = () => "Hello World"
</script>

<div {...hoverable}>Hover me</div>
<div {@attach dnd.draggable(itemData)}>Drag me</div>
```

## 🎯 Key Features

- **Zero Dependencies** - Built purely on Svelte 5 primitives
- **TypeScript First** - Full type safety throughout
- **Tree Shakeable** - Use only what you need
- **Modular Architecture** - Composable middleware system
- **Performance Optimized** - Efficient event handling and DOM management

## 🤝 Contributing

We welcome contributions! Please see our [contributing guide](./contributing.md) for details.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.
