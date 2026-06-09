export const facilitatorPermissionMessage =
  "Only facilitators can use this control.";

type FacilitatorPermissionNoticeProps = {
  canUseFacilitatorActions: boolean;
};

export function FacilitatorPermissionNotice({
  canUseFacilitatorActions,
}: FacilitatorPermissionNoticeProps) {
  return canUseFacilitatorActions ? null : (
    <p className="mt-2 text-[10px] font-medium text-slate-600 sm:text-xs">
      {facilitatorPermissionMessage}
    </p>
  );
}
