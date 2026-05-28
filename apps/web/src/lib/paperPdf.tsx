import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { GeneratedPaper, Question } from "@vedaai/shared";


const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
    lineHeight: 1.4,
  },
  schoolName: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 },
  title: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 3 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    color: "#6b7280",
  },
  generalNote: { fontSize: 8.5, fontStyle: "italic", color: "#6b7280", textAlign: "center", marginTop: 6 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", borderBottomWidth: 1, borderColor: "#e5e7eb", paddingBottom: 3 },
  sectionInstruction: { fontSize: 8.5, fontStyle: "italic", color: "#6b7280", marginTop: 2 },
  questionRow: { flexDirection: "row", marginTop: 8 },
  questionText: { flex: 1, paddingRight: 8 },
  marksCol: { width: 78, textAlign: "right", color: "#6b7280", fontSize: 9 },
  bold: { fontFamily: "Helvetica-Bold" },
  options: { marginTop: 4, marginLeft: 16, flexDirection: "row", flexWrap: "wrap" },
  option: { width: "50%", marginBottom: 2 },
  answerBox: { marginTop: 4, marginLeft: 16, padding: 6, backgroundColor: "#f0fdf4", borderRadius: 3 },
  answerLabel: { fontFamily: "Helvetica-Bold", color: "#16a34a" },
  explanation: { color: "#6b7280", marginTop: 2 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#9ca3af" },
});

interface PdfOptions {
  showAnswers: boolean;
  schoolName: string;
  schoolCity: string;
}

function PaperDocument({ paper, opts }: { paper: GeneratedPaper; opts: PdfOptions }) {
  let counter = 0;
  let answerCounter = 0;
  return (
    <Document title={paper.title} author="VedaAI">
      <Page size="A4" style={styles.page}>
        {}
        <Text style={styles.schoolName}>{opts.schoolName}, {opts.schoolCity}</Text>
        <Text style={styles.title}>{paper.title}</Text>
        <View style={styles.metaRow}>
          <Text>Subject: <Text style={styles.bold}>{paper.subject}</Text></Text>
          <Text>Time Allowed: <Text style={styles.bold}>{paper.duration}</Text></Text>
          <Text>Max Marks: <Text style={styles.bold}>{paper.totalMarks}</Text></Text>
        </View>
        <View style={styles.studentRow}>
          <Text>Name: ______________________</Text>
          <Text>Roll No: ____________</Text>
          <Text>Class &amp; Section: __________</Text>
        </View>
        <Text style={styles.generalNote}>
          General Instructions: All questions are compulsory unless stated otherwise.
        </Text>

        {}
        {paper.sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionInstruction}>{section.instruction}</Text>

            {section.questions.map((q) => {
              counter += 1;
              return (
                <View key={q.id} wrap={false}>
                  <View style={styles.questionRow}>
                    <Text style={styles.questionText}>
                      <Text style={styles.bold}>{counter}. </Text>
                      {q.text}
                    </Text>
                    <Text style={styles.marksCol}>
                      [{q.marks} {q.marks > 1 ? "marks" : "mark"}]
                    </Text>
                  </View>

                  {q.options && q.options.length > 0 && (
                    <View style={styles.options}>
                      {q.options.map((opt, i) => (
                        <Text key={i} style={styles.option}>
                          <Text style={styles.bold}>({String.fromCharCode(97 + i)}) </Text>
                          {opt}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {}
        {opts.showAnswers && (
          <View style={styles.section} break>
            <Text style={[styles.schoolName, { marginTop: 10 }]}>Answer Key</Text>
            <Text style={[styles.title, { marginBottom: 15 }]}>{paper.title}</Text>
            
            {paper.sections.map((section) => (
              <View key={`ans-sec-${section.id}`} style={styles.section} wrap={false}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                
                {section.questions.map((q) => {
                  answerCounter += 1;
                  const optIdx = q.options && q.answer ? q.options.indexOf(q.answer) : -1;
                  const optLetter = optIdx !== -1 ? `(${String.fromCharCode(97 + optIdx)}) ` : "";
                  return (
                    <View key={`ans-${q.id}`} style={{ marginTop: 8 }} wrap={false}>
                      <Text style={styles.bold}>
                        Q{answerCounter}.
                      </Text>
                      <View style={styles.answerBox}>
                        {q.answer && (
                          <Text>
                            <Text style={styles.answerLabel}>Answer: </Text>
                            {optLetter}{q.answer}
                          </Text>
                        )}
                        {q.explanation && (
                          <Text style={styles.explanation}>
                            <Text style={styles.bold}>Explanation: </Text>
                            {q.explanation}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>Generated with VedaAI</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9\-_ ]/gi, "").trim().slice(0, 80) || "question-paper";
}

export async function downloadPaperPdf(paper: GeneratedPaper, opts: PdfOptions): Promise<void> {
  const blob = await pdf(<PaperDocument paper={paper} opts={opts} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(paper.title)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
