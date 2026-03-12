# Voice Chat Testing Guide

## Quick Verification

### 1. File Integrity Check
```bash
cd /openclaw/workspace/canvas-apps/voice-chat/
ls -la
# Should show: index.html, backend-example.js, README.md, VOICE_CHAT_COMPLETE.txt
```

### 2. HTML Validation
```bash
# Check HTML file size
wc -l index.html  # Should be ~400+ lines

# Verify CSS/JS is embedded
grep -c "<style>" index.html  # Should return 1
grep -c "<script>" index.html  # Should return 1
```

### 3. Browser Testing

**Desktop (Chrome/Firefox/Safari):**
1. Open file directly: `file:///openclaw/workspace/canvas-apps/voice-chat/index.html`
2. Allow microphone access when prompted
3. Click "Start Listening"
4. Speak: "Hello"
5. Check:
   - ✅ Transcription appears
   - ✅ Agent responds (echo fallback if no backend)
   - ✅ Audio plays (TTS)
   - ✅ Conversation displayed

**Mobile (iOS Safari / Android Chrome):**
1. Serve on HTTP/HTTPS or use localhost:8000
2. Open on device
3. Verify:
   - ✅ Layout responsive
   - ✅ Touch buttons work
   - ✅ Microphone accessible
   - ✅ TTS plays through speaker

### 4. Feature Checklist

- [ ] Speech Recognition
  - Click "Start Listening"
  - Transcription updates in real-time
  - Status shows "Listening..."
  - Interim results show (blue highlight)

- [ ] Message Handling
  - User message appears in purple bubble
  - Typing indicator shows while processing
  - Agent response appears in white bubble
  - Messages stack in conversation history

- [ ] Text-to-Speech
  - Agent response plays automatically
  - Audio audible through speaker
  - Can be paused/resumed

- [ ] UI Responsiveness
  - Buttons responsive to clicks/taps
  - Scrolls smoothly
  - Empty state message appears on first load
  - Clear button resets conversation

- [ ] Error Handling
  - Microphone denied: Shows error message
  - No browser support: Disables button with message
  - Network error: Shows fallback response
  - Check browser console: No JavaScript errors

### 5. Backend Integration Testing

**With backend running:**
```bash
node backend-example.js  # Runs on port 3000
```

Then in browser:
1. Open voice chat
2. Test voice → transcription → backend response → TTS
3. Check network tab: `POST /api/chat` requests

**Without backend:**
- App falls back to echo responses
- Should still work without backend server

### 6. Console Testing

Open browser console (F12) and run:
```javascript
// Test TTS
speakText("Hello, this is a test");

// Check conversation history
console.log(state.conversationHistory);

// Manual API call
getOpenClawResponse("What is your name?").then(r => console.log(r));

// Check recognition status
console.log(state.recognition);
```

## Performance Benchmarks

- **Page Load:** <100ms
- **First Speech Recognition:** ~500ms
- **Transcription Update:** <200ms
- **TTS Playback:** Immediate
- **Message Render:** <50ms

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Speech Recognition | ✅ | ✅ | ⚠️ (webkit) | ✅ |
| TTS | ✅ | ✅ | ✅ | ✅ |
| getUserMedia | ✅ | ✅ | ✅ | ✅ |
| Responsive Design | ✅ | ✅ | ✅ | ✅ |
| Mobile (iOS) | N/A | N/A | ✅ | N/A |
| Mobile (Android) | ✅ | ✅ | N/A | ✅ |

## Known Limitations

1. **Web Speech API**
   - Browser-specific implementations
   - May not work offline
   - Language support varies by browser

2. **TTS Quality**
   - Web Speech Synthesis has limited voices
   - Consider Eleven Labs for production
   - Audio quality varies by browser

3. **Mobile Safari**
   - Requires user gesture to start speech
   - May need WiFi for better reliability
   - Some language packs may be missing

4. **Network**
   - API calls require functioning `/api/chat` endpoint
   - CORS must be configured on backend
   - Timeout if backend unresponsive

## Debugging

### Enable Detailed Logging

Add this to browser console:
```javascript
// Override console methods to see all logs
const oldLog = console.log;
console.log = function(...args) {
  document.body.innerHTML += `<pre>${args}</pre>`;
  oldLog(...args);
};
```

### Check Network Requests

In DevTools Network tab:
1. Filter to "Fetch/XHR"
2. Should see POST to `/api/chat`
3. Response should be JSON with `response` field
4. Check for CORS errors

### Microphone Permission Debugging

```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log("Available devices:", devices);
  });
```

## Stress Testing

**Send many messages:**
- Send 50 messages in rapid succession
- Conversation history should remain stable
- No memory leaks (check Task Manager)
- Scroll should be smooth

**Long messages:**
- Test 500+ character messages
- TTS should handle long text
- Bubbles should wrap properly
- Scroll updates correctly

## Accessibility Testing

- [ ] Keyboard navigation (Tab, Enter)
- [ ] Screen reader compatibility (NVDA/JAWS)
- [ ] Color contrast (use WebAIM contrast checker)
- [ ] Mobile magnification support

## Deployment Checklist

Before going to production:

- [ ] Test on 3+ browsers
- [ ] Test on mobile (iOS + Android)
- [ ] Verify HTTPS setup
- [ ] Configure CORS on backend
- [ ] Set proper Content-Type headers
- [ ] Implement rate limiting on backend
- [ ] Add logging/monitoring
- [ ] Test error scenarios
- [ ] Load test with multiple concurrent users
- [ ] Document API contract
- [ ] Set up fallbacks
- [ ] Configure CSP headers

## Support & Debugging

**If voice input not working:**
1. Check microphone in OS settings
2. Verify browser has permission
3. Try a different browser
4. Test with `navigator.mediaDevices.enumerateDevices()`
5. Check for HTTPS requirement

**If API responses fail:**
1. Verify backend is running
2. Check CORS headers: `Access-Control-Allow-Origin: *`
3. Verify Content-Type is `application/json`
4. Check backend logs for errors
5. Try direct API call with curl

**If TTS doesn't play:**
1. Check system volume
2. Verify speaker is not muted
3. Try different browser
4. Check browser TTS settings
5. Inspect console for errors

## Next Steps

1. **Deploy backend:** Set up Node.js server with `/api/chat`
2. **Connect to OpenClaw:** Integrate gateway in backend
3. **Test end-to-end:** Full voice flow from user to agent
4. **Monitor:** Add logging, analytics, error tracking
5. **Optimize:** Improve TTS quality, add Whisper for better recognition

---

**Last Updated:** 2024-03-12
**Version:** 1.0 (MVP)
**Status:** Ready for Testing ✅
