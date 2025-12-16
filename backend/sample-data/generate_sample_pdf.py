from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        # Logo placeholder
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'Request for Proposal: Industrial Infrastructure', 0, 0, 'C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

def generate_pdf():
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)
    
    # 1. Introduction
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, '1. Project Overview: Acme Corp Plant Expansion', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.multi_cell(0, 10, 'Acme Corp is soliciting bids for the supply of high-pressure pumping systems and associated valve infrastructure for its new chemical processing facility (Project ID: EXP-2024-X).')
    pdf.ln(5)

    # 2. Technical Specifications
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, '2. Technical Specifications', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.multi_cell(0, 10, 'The following equipment must meet ISO-9001 standards and be delivered by Q3 2024.')
    pdf.ln(5)

    # Table Header
    pdf.set_fill_color(200, 220, 255)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(40, 10, 'Item Ref', 1, 0, 'C', 1)
    pdf.cell(80, 10, 'Description / Requirement', 1, 0, 'C', 1)
    pdf.cell(40, 10, 'Qty', 1, 1, 'C', 1)

    # Rows
    pdf.set_font('Arial', '', 11)
    
    # Item 1
    pdf.cell(40, 10, 'P-101', 1)
    pdf.cell(80, 10, 'Pump, Centrifugal, 2000 PSI, SS316', 1)
    pdf.cell(40, 10, '2 Units', 1, 1)

    # Item 2
    pdf.cell(40, 10, 'P-102', 1)
    pdf.cell(80, 10, 'Pump, Eco-Series, Low Noise', 1)
    pdf.cell(40, 10, '1 Unit', 1, 1)

    # Item 3
    pdf.cell(40, 10, 'V-305', 1)
    pdf.cell(80, 10, 'Control Valve, 4-inch, ISO-9001', 1)
    pdf.cell(40, 10, '5 Units', 1, 1)
    
    pdf.ln(10)
    
    # 3. Compliance
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, '3. Compliance & Safety', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.multi_cell(0, 10, 'All vendors must verify material certifications (ss316) and pressure ratings. Non-compliant bids will be rejected immediately.')

    filename = "backend/sample-data/sample-tender.pdf"
    pdf.output(filename, 'F')
    print(f"Generated realistic PDF at {filename}")

if __name__ == "__main__":
    generate_pdf()
