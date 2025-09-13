# 🎤 Text-to-Voice AI Application - cPanel Installation Guide

## 📦 What You'll Need

1. **cPanel hosting account** with file manager access
2. **The deployment files** (generated static files)
3. **Domain or subdomain** where you want to install the app

## 🚀 Installation Methods

### Method 1: Direct File Upload (Recommended)

#### Step 1: Download the Application Files
1. Copy all files from the `out/` directory
2. These are static HTML, CSS, and JavaScript files that work on any web server

#### Step 2: Upload to Your cPanel Hosting

1. **Login to your cPanel**
2. **Open File Manager**
3. **Navigate to your domain's public folder:**
   - For main domain: `/public_html/`
   - For subdomain: `/public_html/subdomain_name/`
4. **Upload all files from the `out/` directory:**
   - `index.html` (main page)
   - `_next/` folder (contains all assets)
   - SVG icon files
   - `404.html` and `404/` folder

#### Step 3: Set Up Domain/Subdomain
1. **For Main Domain**: Files go directly in `/public_html/`
2. **For Subdomain**: 
   - Create subdomain in cPanel (e.g., `voice.yourdomain.com`)
   - Upload files to `/public_html/voice/`

### Method 2: Extract Archive

If you have the compressed file:

1. **Upload the archive file** (`voice-generator-cpanel.tar.gz`) to your public_html directory
2. **Extract it** using cPanel's File Manager extract feature
3. **Move contents** from the `out/` folder to your desired location

## 🌐 Access Your Application

Once uploaded, visit:
- **Main domain**: `https://yourdomain.com`
- **Subdomain**: `https://voice.yourdomain.com` 
- **Folder**: `https://yourdomain.com/voice-app/`

## 🎯 Key Features Available

✅ **Real AI Voice Generation** - Uses ElevenLabs API
✅ **Multiple Human Voices** - 9 different voice options
✅ **Voice Controls** - Speed, pitch, stability, clarity
✅ **Audio Download** - Save generated voices as MP3
✅ **Voice History** - Track and replay generations
✅ **Mobile Responsive** - Works on all devices
✅ **Dark/Light Theme** - Toggle theme preference

## 🔧 Technical Details

- **Technology**: Static HTML/CSS/JavaScript (no server required)
- **Compatible**: Works on any web hosting (shared, VPS, dedicated)
- **No Database**: All data stored in browser localStorage
- **HTTPS**: Recommended for API calls to work properly
- **Browsers**: Chrome, Firefox, Safari, Edge (modern browsers)

## 📁 File Structure After Installation

```
your-domain/
├── index.html              # Main application page
├── _next/                  # Next.js generated assets
│   ├── static/             # CSS, JS, and other assets
│   └── ...
├── 404.html               # Error page
├── *.svg                  # Icon files
└── index.txt             # Sitemap
```

## 🛠️ Troubleshooting

### Issue: "Application not loading"
**Solution**: 
- Ensure all files are in the correct directory
- Check that `index.html` is in your domain's root folder
- Verify your hosting supports modern JavaScript (ES6+)

### Issue: "Voice generation not working"
**Solution**:
- Ensure your site is served over HTTPS (required for API calls)
- Check browser console for errors
- Verify internet connection (app calls external AI service)

### Issue: "Audio not playing"
**Solution**:
- Enable audio permissions in your browser
- Check browser audio settings
- Try a different browser

### Issue: "Theme not switching"
**Solution**:
- Clear browser cache and reload
- Ensure JavaScript is enabled

## 🔒 Security & Privacy

- **No API Keys Required**: Application is pre-configured
- **Client-Side**: All processing happens in your browser
- **No Data Storage**: Text and audio only stored locally
- **Privacy**: Your text never stored on servers permanently

## 📱 Mobile Optimization

The application is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All screen sizes

## 🆕 Updates

To update the application:
1. Download new version files
2. Replace existing files in your hosting
3. Clear browser cache
4. Reload the application

## 💡 Usage Tips

1. **Best Results**: Use clear, well-punctuated text
2. **Voice Selection**: Try different voices for different content types
3. **Settings**: Adjust speed and pitch for your preference
4. **History**: Use voice history to access previous generations
5. **Download**: Save important voice generations as MP3 files

## 🎨 Customization

You can customize:
- **Colors**: Edit CSS files in `_next/static/css/`
- **Branding**: Modify text in `index.html`
- **Styling**: Adjust Tailwind classes (advanced)

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all files are uploaded correctly
3. Ensure your hosting supports modern web standards
4. Test in different browsers

## 🎉 You're Ready!

Your Text-to-Voice AI application is now installed and ready to use! 

Visit your domain to start converting text to natural human speech with advanced AI voices.

---

**Happy Voice Generating! 🎤✨**