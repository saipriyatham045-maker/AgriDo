import { PaymentMethodType } from '../types';

export interface PaymentGatewayResponse {
  success: boolean;
  paymentId: string;
  error?: string;
}

export const PaymentGateway = {
  /**
   * Simulates the opening of an external payment gateway modal.
   */
  async openCheckout(options: { 
    amount: number; 
    userName: string; 
    method: PaymentMethodType 
  }): Promise<PaymentGatewayResponse> {
    return new Promise((resolve) => {
      console.log(`[PaymentGateway] Opening checkout for ₹${options.amount}...`);
      
      // Simulate the overlay and modal appearance
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
      overlay.style.backdropFilter = 'blur(8px)';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.fontFamily = 'Inter, sans-serif';

      overlay.innerHTML = `
        <div style="background: white; width: 400px; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
          <div style="background: #15803d; color: white; width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-weight: 900; font-size: 24px;">₹</div>
          <h2 style="font-weight: 900; font-size: 24px; color: #111827; margin-bottom: 8px;">AgriDo Secure Gateway</h2>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 32px;">Processing ₹${options.amount.toLocaleString()} via ${options.method}</p>
          
          <div id="loading-bar" style="width: 100%; height: 6px; background: #f3f4f6; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
            <div id="progress" style="width: 0%; height: 100%; background: #16a34a; transition: width 3s ease-in-out;"></div>
          </div>
          
          <p id="status-text" style="font-weight: 800; font-size: 10px; color: #16a34a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 40px;">Verifying Connection...</p>
          
          <div style="display: flex; gap: 12px;">
            <button id="cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; border: 1px solid #e5e7eb; font-weight: 800; font-size: 12px; cursor: pointer; background: white;">CANCEL</button>
            <button id="confirm-btn" style="flex: 1; padding: 14px; border-radius: 14px; background: #111827; color: white; border: none; font-weight: 800; font-size: 12px; cursor: pointer;">CONFIRM PAY</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const progress = overlay.querySelector('#progress') as HTMLElement;
      const status = overlay.querySelector('#status-text') as HTMLElement;
      // Fixed: Cast to HTMLButtonElement to resolve TypeScript error on 'disabled' property access
      const confirmBtn = overlay.querySelector('#confirm-btn') as HTMLButtonElement;
      // Fixed: Cast to HTMLButtonElement to resolve TypeScript error on 'disabled' property access
      const cancelBtn = overlay.querySelector('#cancel-btn') as HTMLButtonElement;

      // Simulate a quick verify phase
      setTimeout(() => {
        progress.style.width = '100%';
        status.innerText = 'Ready for Authorization';
      }, 500);

      confirmBtn.onclick = () => {
        confirmBtn.innerText = 'AUTHORIZING...';
        confirmBtn.style.opacity = '0.5';
        // The HTMLButtonElement type correctly identifies the disabled property
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;

        setTimeout(() => {
          document.body.removeChild(overlay);
          resolve({
            success: true,
            paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          });
        }, 2000);
      };

      cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve({
          success: false,
          paymentId: '',
          error: 'User cancelled transaction'
        });
      };
    });
  }
};
