import VerticalJourneyTimeline from '../components/VerticalJourneyTimeline';
import PageSEO from '../components/PageSEO';

export default function JourneyPage() {
  return (
    <>
      <PageSEO 
        title="Professional Journey & Milestones — Sahil Bhatia" 
        description="Chronological career milestones and evolution vector from frontline merchant sales to enterprise connectivity and autonomous AI systems architecture."
        url="/journey"
      />
      <VerticalJourneyTimeline standalone={true} />
    </>
  );
}
