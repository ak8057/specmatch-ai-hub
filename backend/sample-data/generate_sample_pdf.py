from fpdf import FPDF
import datetime
import os

# -------------------------------
# PDF CLASS
# -------------------------------
class TenderPDF(FPDF):

    def header(self):
        self.set_font('Arial', 'B', 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, 'Acme Corporation | Global Procurement', 0, 0, 'L')
        self.cell(0, 8, 'RFP ID: RFQ-2023-9928X', 0, 1, 'R')
        self.set_draw_color(200, 200, 200)
        self.line(10, 18, 200, 18)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
        self.cell(0, 10, 'CONFIDENTIAL', 0, 0, 'R')

    # -------------------------------
    # SECTION HELPERS
    # -------------------------------
    def section_title(self, num, title):
        self.set_font('Arial', 'B', 14)
        self.set_text_color(0, 51, 102)
        self.cell(0, 10, f'{num}. {title}', 0, 1)
        self.ln(2)

    def section_body(self, text):
        self.set_font('Arial', '', 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 6, text)
        self.ln(4)

    def bullet_list(self, items):
        self.set_font('Arial', '', 11)
        for item in items:
            self.cell(5)
            self.multi_cell(0, 6, f"- {item}")
        self.ln(2)

    # -------------------------------
    # TECHNICAL SPEC BLOCK
    # -------------------------------
    def technical_item(self, item_id, title, mandatory, desirable):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 8, f"{item_id}: {title}", 0, 1)

        self.set_font('Arial', 'B', 11)
        self.cell(0, 7, "Mandatory Requirements:", 0, 1)
        self.set_font('Arial', '', 11)
        self.bullet_list(mandatory)

        self.set_font('Arial', 'B', 11)
        self.cell(0, 7, "Desirable Features:", 0, 1)
        self.set_font('Arial', '', 11)
        self.bullet_list(desirable)

    # -------------------------------
    # TABLE HELPERS
    # -------------------------------
    def table_header(self, headers, widths):
        self.set_font('Arial', 'B', 11)
        for header, width in zip(headers, widths):
            self.cell(width, 8, header, 1, 0, 'C')
        self.ln()

    def table_row(self, values, widths):
        self.set_font('Arial', '', 10)
        for value, width in zip(values, widths):
            self.cell(width, 8, value, 1)
        self.ln()


# -------------------------------
# CREATE PDF
# -------------------------------
pdf = TenderPDF()
pdf.set_auto_page_break(auto=True, margin=15)

# -------------------------------
# COVER PAGE
# -------------------------------
pdf.add_page()
pdf.ln(60)

pdf.set_font('Arial', 'B', 26)
pdf.set_text_color(0, 51, 102)
pdf.cell(0, 20, "REQUEST FOR PROPOSAL", 0, 1, 'C')

pdf.set_font('Arial', '', 16)
pdf.cell(0, 10, "Project Titan – Manufacturing Facility Expansion", 0, 1, 'C')

pdf.ln(25)
pdf.set_font('Arial', '', 12)
pdf.set_text_color(0, 0, 0)
pdf.cell(0, 8, f"Issue Date: {datetime.date.today().strftime('%B %d, %Y')}", 0, 1, 'C')
pdf.cell(0, 8, "Prepared For: Qualified Industrial Equipment Vendors", 0, 1, 'C')

# -------------------------------
# MAIN CONTENT
# -------------------------------
pdf.add_page()

# 1. EXECUTIVE OVERVIEW
pdf.section_title(1, "Executive Overview")
pdf.section_body(
    "Acme Corporation invites proposals from qualified vendors for the supply of "
    "industrial pumping and valve equipment as part of the Project Titan facility expansion. "
    "The objective of this RFP is to identify reliable, compliant, and cost-effective suppliers "
    "capable of meeting operational, safety, and sustainability requirements."
)

# 2. PROJECT OBJECTIVES
pdf.section_title(2, "Project Objectives")
pdf.bullet_list([
    "Ensure high reliability and uninterrupted plant operations",
    "Achieve full compliance with international quality and safety standards",
    "Optimize total lifecycle cost and energy efficiency",
    "Establish long-term vendor partnerships with strong after-sales support"
])

# 3. SCOPE OF SUPPLY
pdf.section_title(3, "Scope of Supply")
pdf.section_body("The selected vendor shall be responsible for the following:")

pdf.bullet_list([
    "Manufacturing and supply of pumps and valves",
    "Factory Acceptance Testing (FAT)",
    "Packaging and delivery to Springfield facility",
    "Submission of technical documentation and test certificates"
])

pdf.section_body("Optional scope (preferred but not mandatory):")
pdf.bullet_list([
    "On-site installation supervision",
    "Commissioning and start-up support",
    "Extended warranty offerings"
])

# 4. TECHNICAL SPECIFICATIONS
pdf.section_title(4, "Technical Specifications")

pdf.technical_item(
    "Item 4.1",
    "High Pressure Industrial Pump",
    mandatory=[
        "Discharge pressure ≥ 2000 PSI",
        "Wetted parts: AISI 316 Stainless Steel",
        "Motor: 460V, 3-phase, 60Hz",
        "Compliance with ANSI/ASME B73.1"
    ],
    desirable=[
        "Condition monitoring sensors",
        "Energy efficiency rating IE3 or higher",
        "MTBF ≥ 30,000 hours"
    ]
)

pdf.technical_item(
    "Item 4.2",
    "Control Valve Assembly",
    mandatory=[
        "Globe valve, 4-inch flange, Class 300",
        "Body: Carbon Steel",
        "Trim: 316 SS + Stellite",
        "ISO 9001 certified manufacturing"
    ],
    desirable=[
        "Low-noise trim design",
        "Fire-safe certification"
    ]
)

# 5. COMPLIANCE & CERTIFICATIONS
pdf.section_title(5, "Compliance & Certifications")
pdf.bullet_list([
    "ISO 9001 – Quality Management Systems",
    "Applicable ANSI / ASME standards",
    "Local environmental and safety regulations",
    "Complete traceability documentation"
])

# 6. COMMERCIAL TERMS
pdf.section_title(6, "Commercial Terms")
pdf.bullet_list([
    "All prices to be quoted in USD, excluding applicable taxes",
    "Price validity: Minimum 90 days",
    "Payment terms: Net 45 days from delivery acceptance",
    "Liquidated damages applicable for delayed delivery"
])

# 7. EVALUATION CRITERIA
pdf.section_title(7, "Evaluation Criteria")

pdf.table_header(
    ["Criteria", "Weightage"],
    [140, 40]
)

pdf.table_row(["Technical Compliance", "40%"], [140, 40])
pdf.table_row(["Commercial Pricing", "30%"], [140, 40])
pdf.table_row(["Delivery Schedule", "15%"], [140, 40])
pdf.table_row(["Vendor Experience & References", "10%"], [140, 40])
pdf.table_row(["Sustainability & ESG", "5%"], [140, 40])

# 8. SUBMISSION GUIDELINES
pdf.section_title(8, "Submission Guidelines")
pdf.section_body(
    "Vendors must submit proposals via the SpecMatch AI Hub portal. "
    "The submission must include technical compliance matrices, commercial pricing breakdowns, "
    "datasheets, delivery schedules, and warranty details. Late submissions will not be considered."
)

# 9. CONFIDENTIALITY
pdf.section_title(9, "Confidentiality")
pdf.section_body(
    "All information contained in this RFP is confidential and intended solely for the purpose "
    "of proposal preparation. Vendors shall not disclose any content without prior written consent "
    "from Acme Corporation."
)

# -------------------------------
# OUTPUT
# -------------------------------
output_path = os.path.join(os.getcwd(), "Professional_RFP_Project_Titan.pdf")
pdf.output(output_path)

print(f"Professional Tender PDF generated at: {output_path}")
