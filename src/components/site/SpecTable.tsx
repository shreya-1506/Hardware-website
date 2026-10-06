import type { Spec } from "@/lib/types";

/**
 * Specification table. Fields are whatever the admin entered, so nothing is
 * hard-coded — different product types carry different rows.
 */
export function SpecTable({ specs }: { specs: Spec[] }) {
  const rows = specs.filter((spec) => spec.name?.trim());
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-steel-200 shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-left">
          <caption className="sr-only">Product specifications</caption>
          <thead>
            <tr className="bg-navy-800 text-white">
              <th
                scope="col"
                className="w-[42%] px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.14em]"
              >
                Specification
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.14em]"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((spec, index) => (
              <tr
                key={`${spec.name}-${index}`}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-steel-50"
                }
              >
                <th
                  scope="row"
                  className="border-t border-steel-200 px-5 py-3.5 align-top text-[13.5px] font-semibold text-navy-800"
                >
                  {spec.name}
                </th>
                <td className="border-t border-steel-200 px-5 py-3.5 align-top text-[13.5px] text-steel-700">
                  {spec.value || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
