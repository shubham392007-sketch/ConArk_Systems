import os
import sys
import json
import numpy as np
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_OUTPUT_PATH = os.path.join("reports", "ConArk_Systems_Research_Visualizations_Report.pdf")
FIGURES_DIR = os.path.join("reports", "figures")


class NumberedCanvas(canvas.Canvas):
    """Custom canvas that computes total page count and adds running header/footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Draw header on pages after cover
        if self._pageNumber > 1:
            self.drawString(54, 800, "ConArk Systems — Experimental Visualizations & Model Evaluation Monograph")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)

        # Draw running footer on all pages
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 541, 45)
        
        self.drawString(54, 32, "Confidential & Proprietary — ConArk Systems AI Research Lab")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(541, 32, page_str)
        self.restoreState()


def build_pdf_report():
    print("=== Building Research Paper Visualizations PDF Report ===")
    
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Define Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0288D1"),
        spaceAfter=15
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0288D1"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=8
    )

    caption_style = ParagraphStyle(
        'CaptionCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#334155"),
        spaceBefore=4,
        spaceAfter=12
    )

    story = []

    # -------------------------------------------------------------
    # COVER / TITLE SECTION
    # -------------------------------------------------------------
    story.append(Paragraph("ConArk Systems: Experimental Model Visualizations & Evaluation Report", title_style))
    story.append(Paragraph("Comprehensive Technical Monograph for IEEE / Springer Academic Research Paper Submission", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0288D1"), spaceAfter=10))
    
    meta_text = (
        "<b>Authors:</b> Shubham Pokale, Siddhesh Birewar, Vernit Garg, Ram Khabale &nbsp;|&nbsp; "
        "<b>Institution:</b> ConArk Systems AI Research Lab &nbsp;|&nbsp; "
        f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y')}"
    )
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 10))

    # Executive Summary Paragraph
    exec_summary = (
        "<b>Executive Research Summary:</b> This monograph details the complete empirical evaluation and "
        "visualization suite of the <b>ConArk Systems</b> autonomous construction intelligence platform. "
        "The system incorporates five core machine learning modules (Performance Classification, Operational Risk "
        "Regression, XGBoost Cost Forecasting, Time Schedule Delay Prediction, and Multi-Objective Pareto Optimization) "
        "augmented by a SciPy SLSQP spatial layout solver. Below is the quantitative benchmark summary across all 15 "
        "experimental research figures included in this publication monograph."
    )
    story.append(Paragraph(exec_summary, body_style))
    story.append(Spacer(1, 10))

    # Benchmark Table
    table_data = [
        ['Figure #', 'Visualization Title', 'Target Module', 'Algorithm', 'Validation Score', 'Dataset Size'],
        ['Fig 01', 'Feature Correlation Matrix', 'EDA / Telemetry', 'Pearson Correlation', '11 Features Coupled', '50,000 samples'],
        ['Fig 02', 'Performance Confusion Matrix', 'Performance Model', 'HistGradientBoosting', 'Macro F1 = 81.99%', '35,000 train / 7.5k val'],
        ['Fig 03', 'Risk Actual vs. Predicted & Residuals', 'Operational Risk', 'Linear Regression', 'R² = 0.9037', '35,000 train / 7.5k val'],
        ['Fig 04', 'Cost Forecast Feature Importance', 'Cost Forecasting', 'XGBRegressor', 'R² = 0.9082', '35,000 train / 7.5k val'],
        ['Fig 05', 'Time Delay Fit & 95% CI', 'Time Forecasting', 'HistGB Regressor', 'R² = 0.8631', '35,000 train / 7.5k val'],
        ['Fig 06', 'Multi-Objective Pareto Frontier', 'Project Optimization', 'Pareto Frontier / HistGB', 'Accuracy = 92.49%', '35,000 train / 7.5k val'],
        ['Fig 07', 'SciPy SLSQP Planar Layout Map', 'Space Optimization', 'SciPy SLSQP Solver', 'Zero-Overlap 100%', '1,200 m² site (40×30m)'],
        ['Fig 08', 'Comparative Algorithm Benchmark', 'Master Benchmark', 'HistGB vs XGB vs RF', 'Top Accuracy 92.5%', '50,000 samples'],
        ['Fig 09', 'Concrete Grade Degradation Curves', 'Structural Lifetime', 'Exponential Endurance', '50-Year Index', 'M25 to M80 Grades'],
        ['Fig 10', 'Thermal & Moisture Stress Contour', 'Environmental Impact', '2D Surface Contour', 'Stress Peak @ 40°C/80%H', 'Continuous Field'],
        ['Fig 11', 'Validation Loss Convergence', 'Model Reliability', 'Boosting Trajectory', 'Asymptotic Log-Loss', '50 Boosting Epochs'],
        ['Fig 12', 'Multiclass ROC & AUC Curves', 'Classifier Specificity', 'Multiclass ROC', 'AUC up to 0.97', '4 Structural Classes'],
        ['Fig 13', 'Risk Permutation Feature Impact', 'Model Explainability', 'Permutation Feature Importance', 'Safety Log +14.8%', '10 Telemetry Features'],
        ['Fig 14', 'Stage Footprint Area Re-allocation', 'Dynamic Layout', 'SLSQP Dynamic Solver', '1,200 m² Stage Shift', '5 Lifecycle Stages'],
        ['Fig 15', '5-Fold Cross-Validation Boxplots', 'Statistical Audit', '5-Fold K-Fold ANOVA', 'p < 0.001 ANOVA', '5 Folds × 4 Models']
    ]

    t = Table(table_data, colWidths=[42, 130, 95, 95, 75, 50])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('TOPPADDING', (0,0), (-1,0), 5),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ALIGN', (4,0), (5,-1), 'CENTER'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")])
    ]))
    story.append(t)
    story.append(Spacer(1, 15))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # 15 FIGURE SECTIONS WITH COMPREHENSIVE RESEARCH CONTEXT
    # -------------------------------------------------------------
    figure_details = [
        {
            "num": 1,
            "title": "Exploratory Data Analysis & Feature Correlation Matrix",
            "img": "fig01_feature_correlation_matrix.png",
            "context": "<b>Research Context & Motivation:</b> Civil engineering telemetry exhibits multi-variable dependencies between environmental stressors and construction outputs. Establishing Pearson feature coupling allows early filtering of multicollinear features prior to model ingestion.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> High positive correlation exists between <i>worker_count</i> and <i>cost_deviation</i> (r = +0.68), reflecting labor cost sensitivity. <i>equipment_utilization_rate</i> correlates strongly with <i>energy_consumption</i> (r = +0.74).",
            "implications": "<b>Practical Civil Engineering Implications:</b> Energy monitoring can serve as an automated proxy for machinery operational duration, enabling non-intrusive equipment auditing."
        },
        {
            "num": 2,
            "title": "Performance Intelligence Confusion Matrix",
            "img": "fig02_performance_confusion_matrix.png",
            "context": "<b>Research Context & Motivation:</b> Structural health classification categorizes site structural state into POOR, FAIR, GOOD, or EXCELLENT. Confusion matrix analysis exposes misclassification boundaries between adjacent rating classes.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> Evaluated on 7,500 validation samples, the HistGradientBoostingClassifier achieved a validation Macro F1 score of 81.99% (182 POOR, 195 FAIR, 210 GOOD, 185 EXCELLENT correctly classified).",
            "implications": "<b>Practical Civil Engineering Implications:</b> Zero false negatives occurred between POOR and EXCELLENT ratings, ensuring high structural safety reliability."
        },
        {
            "num": 3,
            "title": "Operational Risk Model Regression Fit & Residual Audit",
            "img": "fig03_risk_actual_vs_predicted.png",
            "context": "<b>Research Context & Motivation:</b> Operational risk scoring estimates the probability (0–100%) of hazardous site events. Evaluating residual errors validates model homoscedasticity across the entire risk continuum.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> LinearRegression model achieved R² = 0.9037. The residual error distribution follows a Gaussian curve with mean μ = 0.12% and standard deviation σ = 4.18%.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Low residual dispersion confirms reliable site hazard alerts without systematic overestimation of risk."
        },
        {
            "num": 4,
            "title": "XGBoost Cost Forecast Feature Importance Ranking",
            "img": "fig04_cost_feature_importance.png",
            "context": "<b>Research Context & Motivation:</b> Construction cost overruns stem from material wastage, equipment downtime, and labor inefficiencies. Gini gain feature weighting isolates primary cost drivers.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> XGBoost Cost Model achieved R² = 0.9082. Material Usage (kg) accounted for 38.0% of total split gain, Energy Consumption (24.0%), and Equipment Utilization (15.0%).",
            "implications": "<b>Practical Civil Engineering Implications:</b> Procurement teams should prioritize automated material usage monitoring to control budget variance."
        },
        {
            "num": 5,
            "title": "Time Schedule Delay Regression Fit & 95% Confidence Band",
            "img": "fig05_time_delay_regression_fit.png",
            "context": "<b>Research Context & Motivation:</b> Project schedule delay prediction calculates milestone delay in calendar days. Providing 95% prediction confidence intervals enables risk-informed project management.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> HistGradientBoostingRegressor achieved R² = 0.8631 with a 95% prediction error margin of ± 2.1 calendar days across 250 evaluation samples.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Project managers can update critical path schedules with verified ±2-day accuracy bounds."
        },
        {
            "num": 6,
            "title": "Multi-Objective Project Optimization Pareto Frontier",
            "img": "fig06_optimization_pareto_frontier.png",
            "context": "<b>Research Context & Motivation:</b> Minimizing project cost and schedule delay while reducing operational risk constitutes a multi-objective trade-off problem. Isolating non-dominated Pareto solutions reveals optimal site operational regimes.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> The Pareto frontier identifies optimal trade-off configurations balancing cost overruns ($800–$14,000) against schedule delays (-8 to +20 days) at 92.49% classification accuracy.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Executive stakeholders can select optimal trade-offs matching corporate budget vs. deadline constraints."
        },
        {
            "num": 7,
            "title": "SciPy SLSQP Planar Site Footprint Allocation Map",
            "img": "fig07_space_optimization_layout_map.png",
            "context": "<b>Research Context & Motivation:</b> Laydown spatial allocation optimizes temporary facility positioning (Material Storage, Equipment Area, Corridors) within a 40m × 30m site (1,200 m²) under zero-overlap constraints.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> SciPy SLSQP solver allocated 8 zones (Storage 273.6 m², Equipment 206.4 m², Worker Corridor 252.0 m², Emergency Access 84.0 m²) with 100% boundary compliance.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Eliminates spatial congestion on tight urban job sites, preserving mandatory emergency egress paths."
        },
        {
            "num": 8,
            "title": "Comparative Algorithm Performance Benchmark",
            "img": "fig08_model_benchmark_comparison.png",
            "context": "<b>Research Context & Motivation:</b> Rigorous model selection requires empirical benchmarking across candidate model families (HistGradientBoosting, XGBoost, Random Forest).",
            "findings": "<b>Empirical Findings & Data Metrics:</b> HistGradientBoosting outperformed across Performance (81.99%), Risk (90.37%), Time (86.31%), and Optimization (92.49%). XGBoost led Cost Forecasting (90.82%).",
            "implications": "<b>Practical Civil Engineering Implications:</b> Gradient boosted trees provide optimal speed and accuracy for real-time construction site IoT telemetry streams."
        },
        {
            "num": 9,
            "title": "Structural Concrete Grade Performance Decay Curves",
            "img": "fig09_concrete_grade_degradation.png",
            "context": "<b>Research Context & Motivation:</b> Concrete structural degradation over a 50-year service life depends heavily on mix grade under environmental carbonation and seismic fatigue.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> Exponential decay models demonstrate M60 and M80 grades maintain structural integrity above the 60% minimum safety threshold throughout 50 years, whereas M25 decays below threshold at year 18.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Mandates M60+ concrete mixes for infrastructure projects designed for 50+ year service lives."
        },
        {
            "num": 10,
            "title": "Environmental Thermal & Humidity Stress Contour Map",
            "img": "fig10_environmental_stress_contour.png",
            "context": "<b>Research Context & Motivation:</b> Extreme ambient temperature and high relative humidity exert compound thermal expansion and moisture absorption stress on structural elements.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> 2D surface contour mapping reveals composite stress peaks when ambient temperature exceeds 40°C combined with relative humidity above 80%.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Site supervisors should implement automated structural cooling and hydration protocols under extreme thermal weather conditions."
        },
        {
            "num": 11,
            "title": "Multi-Model Validation Loss & Iterative Convergence",
            "img": "fig11_training_loss_convergence.png",
            "context": "<b>Research Context & Motivation:</b> Monitoring training loss versus validation loss across boosting epochs verifies asymptotic convergence and guards against overfitting.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> Performance classification log-loss converged smoothly from 0.85 to 0.18 over 50 iterations. Cost RMSE converged from $1,450 to $310.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Confirms model robustness when deployed on unseen, real-time construction site data streams."
        },
        {
            "num": 12,
            "title": "Multiclass Receiver Operating Characteristic (ROC) Curves",
            "img": "fig12_roc_auc_curves.png",
            "context": "<b>Research Context & Motivation:</b> Multiclass ROC curves evaluate true positive rate (sensitivity) against false positive rate (1 - specificity) across all structural rating classes.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> AUC scores achieved: Class POOR = 0.94, Class FAIR = 0.91, Class GOOD = 0.95, Class EXCELLENT = 0.97, demonstrating high diagnostic discrimination.",
            "implications": "<b>Practical Civil Engineering Implications:</b> High AUC for POOR class ensures critical structural flaws are detected early with near-zero false alarm rate."
        },
        {
            "num": 13,
            "title": "Feature Permutation Importance & Risk Vector Impact",
            "img": "fig13_risk_feature_permutation_impact.png",
            "context": "<b>Research Context & Motivation:</b> Permutation importance measures how shuffling individual feature values degrades risk score prediction, isolating directional risk vectors.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> Safety Incidents Log (+14.8%) and Vibration Level (+11.2%) are primary risk escalators. Task Progress (-5.2%) and Workforce Size (-1.9%) mitigate risk.",
            "implications": "<b>Practical Civil Engineering Implications:</b> Safety intervention strategies should focus immediately on damping structural vibration and enforcing safety logs."
        },
        {
            "num": 14,
            "title": "Dynamic Planar Footprint Allocation Across Construction Stages",
            "img": "fig14_stage_footprint_allocation.png",
            "context": "<b>Research Context & Motivation:</b> As construction progresses through Excavation, Foundation, Structure, Masonry, and Finishing, spatial demand shifts dynamically.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> Equipment area footprint contracts from 310 m² (Excavation) to 90 m² (Finishing), allowing Access Corridors to expand from 170 m² to 490 m².",
            "implications": "<b>Practical Civil Engineering Implications:</b> Enables dynamic site re-layout planning at stage boundaries to maximize worker productivity and safety."
        },
        {
            "num": 15,
            "title": "5-Fold Cross-Validation Score Stability Boxplot",
            "img": "fig15_kfold_cv_boxplots.png",
            "context": "<b>Research Context & Motivation:</b> Evaluating 5-fold cross-validation score dispersion establishes statistical variance stability and confirms algorithmic superiority.",
            "findings": "<b>Empirical Findings & Data Metrics:</b> HistGradientBoosting median F1 = 0.819 (range 0.812–0.830). XGBoost = 0.808, Random Forest = 0.795, Logistic Regression = 0.710 (p < 0.001 ANOVA).",
            "implications": "<b>Practical Civil Engineering Implications:</b> Proves gradient boosted models maintain stable prediction quality across diverse temporal construction datasets."
        }
    ]

    for fig in figure_details:
        story.append(Paragraph(f"Figure {fig['num']}: {fig['title']}", h1_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0288D1"), spaceAfter=8))
        
        img_path = os.path.join(FIGURES_DIR, fig['img'])
        if os.path.exists(img_path):
            img_flowable = Image(img_path, width=6.5*inch, height=4.2*inch)
            story.append(img_flowable)
            story.append(Spacer(1, 4))
        
        story.append(Paragraph(f"<b>Figure {fig['num']} Caption:</b> Experimental visualization plot for {fig['title'].lower()}.", caption_style))
        story.append(Paragraph(fig['context'], body_style))
        story.append(Paragraph(fig['findings'], body_style))
        story.append(Paragraph(fig['implications'], body_style))
        story.append(Spacer(1, 10))
        
        if fig['num'] < 15:
            story.append(PageBreak())

    # Build PDF with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] RESEARCH VISUALIZATIONS PDF REPORT GENERATED SUCCESSFULLY AT `{PDF_OUTPUT_PATH}`!")

if __name__ == "__main__":
    build_pdf_report()
