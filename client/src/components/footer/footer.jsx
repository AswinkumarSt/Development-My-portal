import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-label">Made with ♡ in Kerala</span>
        </div>
        <div className="footer-right">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <span className="footer-separator">|</span>
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;