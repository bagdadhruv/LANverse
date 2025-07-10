#!/usr/bin/env python3
"""
Simple HTTPS server for LANverse PWA development
Uses Python's built-in libraries to generate certificates
"""

import http.server
import ssl
import socketserver
import os
import sys
import ipaddress
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from datetime import datetime, timedelta, timezone

# Configuration
PORT = 8443
CERT_FILE = "localhost.pem"
KEY_FILE = "localhost-key.pem"

def create_self_signed_cert():
    """Create self-signed certificate using cryptography library"""
    if not (os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE)):
        print("🔐 Creating self-signed certificate...")
        
        try:
            # Generate private key
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
            )
            
            # Create certificate
            subject = issuer = x509.Name([
                x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
                x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Local"),
                x509.NameAttribute(NameOID.LOCALITY_NAME, "Local"),
                x509.NameAttribute(NameOID.ORGANIZATION_NAME, "LANverse Dev"),
                x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
            ])
            
            cert = x509.CertificateBuilder().subject_name(
                subject
            ).issuer_name(
                issuer
            ).public_key(
                private_key.public_key()
            ).serial_number(
                x509.random_serial_number()
            ).not_valid_before(
                datetime.now(timezone.utc)
            ).not_valid_after(
                datetime.now(timezone.utc) + timedelta(days=365)
            ).add_extension(
                x509.SubjectAlternativeName([
                    x509.DNSName("localhost"),
                    x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
                ]),
                critical=False,
            ).sign(private_key, hashes.SHA256())
            
            # Write private key
            with open(KEY_FILE, "wb") as f:
                f.write(private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                ))
            
            # Write certificate
            with open(CERT_FILE, "wb") as f:
                f.write(cert.public_bytes(serialization.Encoding.PEM))
            
            print("✅ Certificate created!")
            
        except ImportError:
            print("❌ cryptography library not found. Installing...")
            os.system("pip install cryptography")
            print("✅ Please run the script again after installation.")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error creating certificate: {e}")
            sys.exit(1)

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