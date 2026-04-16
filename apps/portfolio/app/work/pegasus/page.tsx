import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Manufacturing Quality Dashboards — Case Study",
  description:
    "How I automated daily quality metrics for a truck parts manufacturer using Power BI, Power Automate, and Office Scripts.",
  pathname: "/work/pegasus",
});

export default function PegasusCaseStudyPage() {
  return (
    <article
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-16 md:pr-[180px] lg:pr-[220px] xl:pr-[400px] 2xl:pr-[480px] md:max-w-none md:ml-6 lg:ml-12"
    >
      <nav className="mb-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to work</span>
        </Link>
      </nav>

      <header className="mb-12">
        <p className="text-xs md:text-sm font-mono text-muted-foreground mb-3">Case Study</p>
        <h1 className="font-display text-2xl md:text-4xl font-medium mb-4 text-center md:text-left">
          Manufacturing Quality Dashboards: Automating Daily Metrics for a Truck Parts Manufacturer
        </h1>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {[
            "Power BI",
            "Power Automate",
            "DAX",
            "Power Query",
            "SharePoint",
            "Office Scripts",
          ].map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full font-mono text-xs bg-[hsl(var(--eucalyptus))] text-[hsl(var(--thorn))] dark:bg-[hsl(var(--rust))] dark:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-14 text-xs md:text-base text-muted-foreground">
        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            The Problem
          </h2>
          <div className="space-y-4">
            <p>
              A manufacturing support service company that kits heavy-duty truck parts for a major OEM was tracking two daily quality metrics entirely by hand. Every morning, a manager received an email from the OEM with the day&apos;s defect data as an Excel attachment. She&apos;d open the file, manually filter and count defects, calculate the metrics, and build PowerPoint slides with charts reflecting the day&apos;s numbers. Those slides were broadcast to floor screens so the production team could see how they were performing.
            </p>
            <p>
              After the initial numbers went up, her team would spend the day researching each defect — determining whether it was truly their error or a misattribution. As they worked through the list, she&apos;d update master tracking spreadsheets and eventually rebuild the slides with the final verified figures.
            </p>
            <p>
              The process had many friction points and opportunities for data to go stale or be inaccurate. The initial build consumed 30–45 minutes every morning. Post-verification slide rebuilds added more time. The manual chain from Excel to PowerPoint to floor screens introduced the potential for copy-paste errors and formula mistakes at every step.
            </p>
            <p>
              The client knew she wanted Power BI dashboards but wasn&apos;t sure how far the automation could go. She wasn&apos;t sure the daily email ingestion, file conversion, and refresh triggering could all happen without manual intervention. Through the requirements gathering process, I identified Power Automate and Office Scripts as the pieces that could close the gap between &ldquo;someone has to do this by hand&rdquo; and a fully event-driven pipeline. The goal became automated dashboards that updated themselves when the daily email arrived and again when the team finished verifying the data, with no manual steps in between.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            The Metrics
          </h2>
          <div className="space-y-4">
            <p>Two quality metrics were the focus of the project:</p>
            <p>
              <strong className="text-foreground">MTR (Material Test Ready)</strong> measures the percentage of trucks that passed through the production line without a supply-chain defect attributable to this company. It&apos;s calculated as (Trucks &minus; Defects) / Trucks, where each truck is counted once regardless of how many individual defects it has. Higher is better. The target is 97.5%.
            </p>
            <p>
              <strong className="text-foreground">WPU (Write-Ups Per Unit)</strong> measures the total defect count per truck. Every individual defect on every truck counts. It&apos;s calculated as Defects / Trucks. Lower is better. The target is 0.19.
            </p>
            <p>
              Both metrics are tracked at daily, month-to-date, and year-to-date intervals, with trend lines, prior-week breakdowns by defect category, and detail views of the current day&apos;s individual defects.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Architecture
          </h2>
          <div className="space-y-4">
            <p>
              The solution has four data inputs and a conditional processing layer that automatically switches between preliminary and verified data.
            </p>
            <p>
              Two daily emails arrive from the OEM&apos;s system with Excel file attachments: one for MTR defects and one for WPU defects. Power Automate flows detect these emails, extract the attachments, and save them to designated SharePoint folders. The WPU file arrives in <code className="font-mono text-sm">.xlsb</code> (binary Excel) format, which Power BI&apos;s cloud service can&apos;t refresh against directly. An Office Scripts conversion pipeline handles this: the flow stages the binary file, runs a script that reads the cell values into JSON via Excel Online&apos;s API, then writes that JSON into a clean <code className="font-mono text-sm">.xlsx</code> that Power BI can consume.
            </p>
            <p>
              Two master files live on SharePoint and are edited directly by the quality team during their daily verification process. When the team saves changes to either master file, a separate Power Automate flow detects the modification and triggers a dashboard refresh.
            </p>
            <p>
              The key architectural challenge was handling the transition between preliminary and verified data. When the daily email first arrives, the dashboard needs to show all reported defects. Hours later, when the team finishes verifying the data and updates the master file, the dashboard needs to seamlessly switch to the verified figures — which typically show fewer defects, different category assignments, and different aggregate percentages.
            </p>
            <p>
              This is handled through conditional source-switching logic built into the Power Query layer. Each query checks whether the master file contains data for the same date as the daily file. If it does, the master&apos;s data takes precedence. If it doesn&apos;t, the daily file&apos;s data is used. This switching happens at refresh time with no manual intervention, meaning the dashboard simply reflects whichever source is most authoritative for any given date.
            </p>
            <p>
              The same conditional logic extends to the aggregate metrics. The daily/monthly/yearly percentage cards don&apos;t read pre-computed values from any source file. Instead, they compute from the underlying truck counts and defect counts, which themselves come from whichever source is most current at the time of refresh. This minimizes the possibility of manual data entry and copy-paste errors.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Data Model
          </h2>
          <div className="space-y-4">
            <p>
              The Power BI data model uses a star schema centered on a generated date dimension table. Fourteen tables feed two dashboard pages.
            </p>
            <p>
              For each metric, the pattern is the same: a daily file query reads the current email attachment, a PriorDay query conditionally switches between daily and master sources for the detail view, a Daily aggregate query conditionally switches between master history and a computed aggregate for the time-series, a History query reads the master file&apos;s historical records, and a Facts table appends history and daily with deduplication so that master values always win when both sources contain the same date.
            </p>
            <p>
              The MTR side has an additional layer of complexity. The daily defect file doesn&apos;t include defect category assignments; those are only populated during the verification process. So the PriorDay query joins back to the daily file on a composite key to pull defect type classifications into the master-sourced rows, ensuring the detail table always shows whether each defect was a &ldquo;Missing in Kit&rdquo; or &ldquo;Wrong in Kit&rdquo; regardless of which source is active.
            </p>
            <p>
              All queries went through a cleanup pass to remove unused columns, eliminate redundant transformations, and add targeted error handling for cells containing Excel formula errors (<code className="font-mono text-sm">#N/A</code> from broken VLOOKUPs in the source files).
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Automation Pipeline
          </h2>
          <div className="space-y-5">
            <p>Four Power Automate flows handle the end-to-end pipeline:</p>
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">Flow 1 — MTR Daily</h3>
              <p>
                Watches for emails containing &ldquo;MTR&rdquo; in the subject line with attachments. It saves the <code className="font-mono text-sm">.xlsx</code> attachment to SharePoint, overwriting the previous day&apos;s file, then triggers a Power BI dataset refresh.
              </p>
            </div>
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">Flow 2 — WPU Daily</h3>
              <p>
                Handles the more complex <code className="font-mono text-sm">.xlsb</code> conversion. It watches for emails containing &ldquo;WPU&rdquo; in the subject line, applies a content type filter inside the attachment loop to skip inline signature images, stages the binary file to a permanent SharePoint placeholder using an Update File action to keep the file&apos;s drive item ID stable across runs, executes the ReadWPUData Office Script to extract cell values as JSON, executes the WriteWPUData script to write that JSON into the target <code className="font-mono text-sm">.xlsx</code>, and triggers a refresh. The file referencing was the trickiest part of this flow: SharePoint&apos;s connector and Excel Online&apos;s connector use incompatible identifier formats, so dynamic file references are resolved through Get File Metadata Using Path actions at runtime.
              </p>
            </div>
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">Flows 3 &amp; 4 — Master File Edits</h3>
              <p>
                Watch the team-facing folder for modifications to the two master files and trigger a dataset refresh on save. These are intentionally simple; the conditional source-switching logic in Power Query handles the complexity, so the flows just need to tell Power BI to reload.
              </p>
            </div>
            <p>
              Hourly scheduled refreshes from 6 AM to 6 PM serve as a safety net in case a flow-triggered refresh fails. The service account runs on a Premium Per User license with an allowance of 48 refreshes per day.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            IT Coordination and Data Governance
          </h2>
          <div className="space-y-4">
            <p>
              The automation pipeline runs entirely on the client&apos;s M365 tenant under a dedicated service account, which meant coordinating with their IT team on infrastructure, permissions, and security from the start.
            </p>
            <p>
              Early in the project, the service account lacked the SharePoint site-level access needed for Power Automate to write files. The client&apos;s existing SharePoint structure wasn&apos;t designed for automation, so I worked with IT to stand up a dedicated SharePoint site specifically for this project, with the service account provisioned as a Member. This gave us a clean separation between the automation infrastructure and the rest of the organization&apos;s SharePoint environment.
            </p>
            <p>
              The folder structure was designed around a separation-of-concerns model. The <code className="font-mono text-sm">Automation/</code> folder, where flows write daily files and stage conversions, is restricted to the service account only, with inherited permissions broken so that team members can&apos;t accidentally modify or delete flow-managed files. The <code className="font-mono text-sm">Masters/</code> folder, where the team does their daily editing, has standard Edit access.
            </p>
            <p>
              Licensing was another coordination point. The service account started on a Power BI Pro license, which caps automated refreshes at 8 per day. With four flows potentially triggering refreshes plus scheduled fallbacks, the limit was too tight for a heavy scrubbing day. After identifying the constraint, I recommended upgrading the service account to Premium Per User, which IT handled and brought the refresh allowance up to 48 times per day.
            </p>
            <p>
              The Power BI workspace is configured with role-based access: the service account and the primary manager have Admin roles, and other team members are added as Viewers. Version history is enabled on the SharePoint document library so that bad edits to master files can be rolled back without developer intervention. Refresh failure notifications are configured to alert both the service account and the manager so issues surface quickly.
            </p>
            <p>
              None of this is glamorous work, but it&apos;s the kind of infrastructure that determines whether an automation project actually survives in production or quietly breaks the first time someone changes a password or reorganizes a folder.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            The Dashboard
          </h2>
          <div className="space-y-4">
            <p>Each metric gets a full 1920&times;1080 dashboard page designed for floor screen display.</p>
            <p>
              The MTR page shows daily, month-to-date, and year-to-date percentages as headline cards. A three-month trend line plots daily MTR against the 97.5% goal. A detail table lists the current day&apos;s individual defects with part numbers, category codes, and defect category assignments, which show &ldquo;Pending&rdquo; for each category before verification and the actual assignments after the master is updated. A prior-week column chart breaks down defects by category for the previous Sunday-through-Saturday window. A tow-off/no-dyno count card tracks a specific subset of high-impact defects for the current day.
            </p>
            <p>
              The WPU page follows the same structure adapted for the WPU metric: headline cards, trend line against the 0.19 goal, a prior-day column chart breaking defects down by category, and a prior-week category breakdown.
            </p>
            <p>
              Both pages include a &ldquo;Last Refreshed&rdquo; timestamp in Eastern time with DST-aware conversion, so the floor team always knows how current the data is.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Challenges
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">
                The <code className="font-mono text-sm">.xlsb</code> conversion pipeline
              </h3>
              <p>
                Required navigating Power Automate&apos;s connector ecosystem, where the SharePoint connector and the Excel Online connector don&apos;t share a common file identifier format. Passing a file reference from a SharePoint action to an Excel Online script action required dynamic resolution through Get File Metadata Using Path lookups at runtime. The staging architecture also needed careful design, which ended up as permanent placeholder files with Update File actions to keep drive item IDs stable across runs, rather than deleting and recreating files each time (which generates new IDs and breaks downstream references).
              </p>
            </div>
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">Inline email attachments</h3>
              <p>
                Caused the attachment processing loop to silently process the wrong file. The OEM&apos;s email included a logo image in the signature as an inline attachment. The flow was iterating over all attachments and hitting the image first, which passed through the original filename-based filter as a non-match but consumed the loop iteration. The fix was adding a content type filter inside the loop that checks for <code className="font-mono text-sm">sheet</code> in the MIME type, catching both <code className="font-mono text-sm">.xlsb</code> and <code className="font-mono text-sm">.xlsx</code> while excluding images and other non-Excel attachments.
              </p>
            </div>
            <div>
              <h3 className="text-sm md:text-base text-foreground font-medium mb-1 text-center md:text-left">Master-over-daily source switching</h3>
              <p>
                Was a requirement that emerged after the initial client review. The dashboards were originally built to read from the daily files, with historical data appended from the master. The client&apos;s review revealed that the detail table was showing all 10 reported defects for a day even after she had verified only 1 as valid. The fix was building conditional source-switching logic into the Power Query layer — each query checks whether the master contains data for the daily file&apos;s date and uses the master when it does. This required adding two new conditional tables and updating the aggregate queries and several DAX measures to work with the new structure.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Results
          </h2>
          <p>
            The automation eliminates an estimated 200–280 hours per year of manual work — the daily PowerPoint builds, post-verification rebuilds, and the communication overhead of pushing updated slides to floor screens. The floor now has access to same-day metrics that update automatically as soon as the email arrives and again as the team works through their verification process. Manual data entry and calculation errors are eliminated from the ingestion and metric computation steps entirely.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground mb-5 text-center md:text-left">
            Reflection
          </h2>
          <div className="space-y-4">
            <p>
              This was a client project, not a personal build, and that changed the dynamics in ways I didn&apos;t fully anticipate. The technical challenges were real but solvable. The harder part was navigating the gap between what I understood about the client&apos;s process and what the process actually entailed day-to-day.
            </p>
            <p>
              The master-over-daily requirement is the clearest example. I built what I thought was correct based on the initial discovery, and the client review revealed an assumption I didn&apos;t know I was making. That was partly on me; I could have probed deeper into the full lifecycle of the data during discovery. But part of it is the nature of client work. Domain experts don&apos;t always articulate the parts of their process that feel obvious to them, and developers don&apos;t always know which questions to ask until they&apos;ve built something that doesn&apos;t quite fit. The lesson isn&apos;t &ldquo;ask better questions&rdquo; in the abstract but rather to map the complete journey of the data from arrival through final use, not just the ingestion step.
            </p>
            <p>
              The other lesson was about Microsoft&apos;s connector ecosystem. Power Automate, SharePoint, Excel Online, and Power BI are all Microsoft products, but they don&apos;t always speak the same language. File IDs, path formats, and authentication contexts vary between connectors in ways that aren&apos;t always obvious and only surface when you&apos;re wiring them together in production. A significant portion of the automation work was just figuring out how to get one Microsoft service to correctly reference a file that another Microsoft service had just created.
            </p>
            <p>
              The project exercised a different set of muscles than building a greenfield application. There&apos;s no choosing your own stack, no designing your own data format, no controlling the inputs. You&apos;re working within the constraints of whatever tools the client already has, whatever format the upstream system sends, and whatever process the team has evolved over years of doing things manually. Making it all work together cleanly and resilient enough that a non-technical team can rely on it daily is its own kind of engineering challenge.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-border/50 flex justify-end">
        <Link
          href="/work"
          className="text-xs md:text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to work
        </Link>
      </div>
    </article>
  );
}
