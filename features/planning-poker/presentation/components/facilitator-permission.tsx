export const facilitatorPermissionMessage =
  "Only facilitators can use this control.";

type FacilitatorPermissionNoticeProps = {
  canUseFacilitatorActions: boolean;
};

export function FacilitatorPermissionNotice({
  canUseFacilitatorActions,
}: FacilitatorPermissionNoticeProps) {
  return canUseFacilitatorActions ? null : (
    <p className="mt-3 text-sm font-medium text-slate-500">
      {facilitatorPermissionMessage}
    </p>
  );
}
