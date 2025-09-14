import React, { useRef } from "react";
import { ScoreData } from "./TestResults";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import certBGComponentBR from "@/assets/images/certificate-props/bottom-right-corner.png";
import certBGComponentTL from "@/assets/images/certificate-props/top-left-corner.png";
import certBGComponentEX from "@/assets/images/certificate-props/extra-bg-design.png";
import certBGComponentHD from "@/assets/images/certificate-props/heading.png";
import logo from "@/assets/images/logo.png";

const TestCertificate = ({ scoreData }: { scoreData: ScoreData }) => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certificateRef = useRef(null);

  const downloadCertificate = () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement) return;

    const downloadBtn = document.getElementById(
      "download-btn"
    ) as HTMLButtonElement;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = "Generating PDF...";
    downloadBtn.disabled = true;

    setTimeout(() => {
      html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
      })
        .then((canvas: any) => {
          const imgData = canvas.toDataURL("image/png", 1.0);
          const pdf = new jsPDF("l", "mm", "a4");
          const imgWidth = 297;
          const pageHeight = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save(
            `${scoreData.test.title.toUpperCase()}_CERTIFICATE_${
              scoreData.user.first_name
            }_${scoreData.user.last_name}.pdf`
          );

          downloadBtn.textContent = originalText;
          downloadBtn.disabled = false;
        })
        .catch((error: any) => {
          console.error("Error generating PDF:", error);

          const messageBox = document.createElement("div");
          messageBox.innerHTML = `
          <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-xl text-center">
              <h3 class="text-xl font-bold text-red-600 mb-2">Error</h3>
              <p class="text-gray-700">There was an error generating the PDF. Please try again.</p>
              <button onclick="this.parentElement.parentElement.remove()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
            </div>
          </div>
        `;
          document.body.appendChild(messageBox);

          downloadBtn.textContent = originalText;
          downloadBtn.disabled = false;
        });
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center font-inter max-xl:hidden mb-4">
        <div className="w-full max-w-4xl">
          <div className="bg-gray-50 md:p-12 border border-gray-200">
            <div
              ref={certificateRef}
              className="w-full aspect-[297/210] relative p-4 md:p-8 flex items-center justify-center bg-[#f2f2f2]"
            >
              <div className="absolute inset-0 z-0">
                <CertificateBackground />
              </div>

              <div className="w-full h-full relative z-10 inset-y-0 text-center text-gray-800">
                {/* HEADING PLACEHOLDER */}
                <div className="w-3/12 aspect-video"></div>

                {/* HOLDER NAME */}
                <p className="text-sm mb-4">{`THIS CERTIFICATE IS PROUDLY PRESENTED TO`}</p>
                <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 uppercase">
                  {`${scoreData.user.first_name} ${scoreData.user.last_name}`}
                </h3>
                <p className="text-lg mt-2">{`FOR THE SUCCESSFUL COMPLETION OF:`}</p>

                {/* CERTIFICATE COURSE */}
                <div className="w-full max-w-2xl mx-auto px-6 pt-6 pb-6 flex items-center gap-2">
                  <span className="text-gray-600 text-base">Course</span>
                  <div className="flex-1 px-4 py-2 border-b border-b-gray-800 text-lg font-serif">
                    {scoreData.test.title}
                  </div>
                  <div className="w-4"></div>
                  <span className="text-gray-600 text-base">Date</span>
                  <div className="w-fit px-4 py-2 border-b border-b-gray-800 text-lg font-serif">
                    {scoreData.attempt_time.substring(0, 16)}
                  </div>
                </div>

                {/* ATTESTATION */}
                <div className="w-full max-w-xl mx-auto p-1 text-base text-gray-800 opacity-80">
                  {`This certificate attests to the holder's commitment to excellence, professionalism, and lifelong learning.`}
                </div>

                {/* SIGNATURE */}
                <div className="w-full max-w-xl mx-auto flex justify-between items-center mt-10">
                  <div className="flex-1 text-center">
                    <div className="w-48 h-px bg-gray-400 mx-auto"></div>
                    <p className="text-sm mt-1 text-gray-600">
                      Authorized Signature
                    </p>
                  </div>
                  <div className="flex-1 text-center text-sm">
                    <span className="text-gray-600">
                      {`Certificate ID [Unique Serial Number]:`}
                    </span>
                    <br />
                    <span className="font-serif text-base">
                      {scoreData.serial_number}
                    </span>
                  </div>
                </div>

                {/* CERTIFICATE SERIAL NUMBER */}
              </div>
            </div>
          </div>

          <div className="w-full px-8">
            <button
              id="download-btn"
              onClick={downloadCertificate}
              className={`w-full flex justify-center py-3 my-4 px-6 border border-transparent rounded-full shadow-lg text-lg font-medium text-white transition-all duration-300 transform bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105`}
            >
              {"Download as PDF"}
            </button>
          </div>
        </div>
      </div>
      <div className="xl:hidden w-full p-6">
        <p className="text-center text-gray-600">
          View on your desktop to download your certificate.
        </p>
      </div>
    </>
  );
};

export default TestCertificate;

function CertificateBackground() {
  const colors = ["#000928"];
  return (
    <>
      <div className="w-full h-full inset-0 relative overflow-hidden bg-[#f2f2f2]">
        <div
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top",
            backgroundImage: `url("${certBGComponentTL.src}")`,
          }}
          className="absolute z-0 top-0 left-0 w-3/12 aspect-square"
        ></div>
        <div
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("${certBGComponentBR.src}")`,
          }}
          className="absolute z-0 bottom-0 right-0 w-3/12 aspect-square"
        ></div>
        <div
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("${certBGComponentEX.src}")`,
          }}
          className="absolute z-0 top-0 right-0 w-2/5 aspect-video"
        ></div>
        <div
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("${certBGComponentEX.src}")`,
          }}
          className="absolute z-0 -bottom-6 -left-6 w-2/5 aspect-video"
        ></div>
        <div className="absolute top-2 left-0 w-full flex justify-center">
          <div
            style={{
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url("${certBGComponentHD.src}")`,
            }}
            className="w-3/12 aspect-video"
          ></div>
        </div>
        <div
          style={{
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("${logo.src}")`,
          }}
          className="w-3/12 h-[60px] absolute top-2 right-2 z-10"
        ></div>
      </div>
    </>
  );
}
