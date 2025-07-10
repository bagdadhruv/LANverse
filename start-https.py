#!/usr/bin/env python3
"""
Simple HTTPS server for LANverse PWA development
"""

import http.server
import ssl
import socketserver
import os
import sys

# Configuration
PORT = 8443
CERT_FILE = "localhost.pem"
KEY_FILE = "localhost-key.pem"

def create_self_signed_cert():
    """Create self-signed certificate if it doesn't exist"""
    if not (os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE)):
        print("🔐 Creating self-signed certificate...")
        os.system(f'openssl req -x509 -newkey rsa:4096 -keyout {KEY_FILE} -out {CERT_FILE} -days 365 -nodes -subj "/CN=localhost"')
        print("✅ Certificate created!")

def start_server():
    """Start HTTPS server"""
    # Create certificate if needed
    create_self_signed_cert()
    
    # Create HTTPS server
    httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
    
    # Wrap with SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT_FILE, KEY_FILE)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"🚀 LANverse PWA Server running on https://localhost:{PORT}")
    print(f"📱 PWA Installation: https://localhost:{PORT}")
    print(f"🌐 Browser Access: https://localhost:{PORT}")
    print(f"⚠️  Accept the security warning in your browser (self-signed certificate)")
    print(f"🛑 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped!")
        httpd.shutdown()

if __name__ == "__main__":
    start_server() 