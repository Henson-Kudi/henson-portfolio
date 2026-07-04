import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import type { Experience } from "@prisma/client"
import { fmtPeriod } from "@/lib/format"
import { cvProfile } from "@/lib/cv-content"

const COLORS = {
  ink: "#1c1a15",
  soft: "#3b382f",
  muted: "#78725f",
  brand: "#a54a24",
  line: "#ddd6c6",
}

const styles = StyleSheet.create({
  page: { paddingVertical: 42, paddingHorizontal: 48, fontFamily: "Helvetica", color: COLORS.soft },
  name: { fontFamily: "Times-Bold", fontSize: 24, color: COLORS.ink },
  title: { fontFamily: "Times-Roman", fontSize: 12, color: COLORS.brand, marginTop: 3 },
  contact: { fontSize: 8.5, color: COLORS.muted, marginTop: 8, lineHeight: 1.5 },

  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: COLORS.brand,
    textTransform: "uppercase",
    borderBottomWidth: 0.7,
    borderBottomColor: COLORS.line,
    paddingBottom: 4,
    marginBottom: 8,
  },
  body: { fontSize: 9.5, lineHeight: 1.5, color: COLORS.soft },

  job: { marginBottom: 11 },
  jobHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  role: { fontFamily: "Times-Bold", fontSize: 11, color: COLORS.ink },
  period: { fontSize: 8.5, color: COLORS.muted },
  company: { fontSize: 9, color: COLORS.brand, marginTop: 1, marginBottom: 3 },
  bullet: { fontSize: 9.5, lineHeight: 1.5, color: COLORS.soft, marginTop: 1, paddingLeft: 8 },

  skillRow: { flexDirection: "row", marginBottom: 4 },
  skillGroup: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.ink, width: 120 },
  skillItems: { fontSize: 9, color: COLORS.soft, flex: 1, lineHeight: 1.4 },
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

export function CvDocument({ experiences }: { experiences: Experience[] }) {
  const p = cvProfile
  const contact = [p.location, p.email, p.phone, p.website, p.linkedin, p.github]
    .filter(Boolean)
    .join("   ·   ")

  return (
    <Document author={p.name} title={`${p.name} — CV`} subject={p.title}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.title}>{p.title}</Text>
          <Text style={styles.contact}>{contact}</Text>
        </View>

        <Section title="Summary">
          <Text style={styles.body}>{p.summary}</Text>
        </Section>

        <Section title="Experience">
          {experiences.map((e) => (
            <View key={e.id} style={styles.job} wrap={false}>
              <View style={styles.jobHead}>
                <Text style={styles.role}>{e.role}</Text>
                <Text style={styles.period}>{fmtPeriod(e.startDate, e.endDate)}</Text>
              </View>
              <Text style={styles.company}>
                {[e.company, e.location].filter(Boolean).join("  ·  ")}
              </Text>
              {e.summary ? <Text style={styles.body}>{e.summary}</Text> : null}
              {e.highlights.map((h, i) => (
                <Text key={i} style={styles.bullet}>
                  •  {h}
                </Text>
              ))}
            </View>
          ))}
        </Section>

        <Section title="Skills">
          {p.skills.map((g) => (
            <View key={g.group} style={styles.skillRow}>
              <Text style={styles.skillGroup}>{g.group}</Text>
              <Text style={styles.skillItems}>{g.items.join("  ·  ")}</Text>
            </View>
          ))}
        </Section>

        <Section title="Languages">
          <Text style={styles.body}>
            {p.languages.map((l) => `${l.name} (${l.level})`).join("      ·      ")}
          </Text>
        </Section>
      </Page>
    </Document>
  )
}
