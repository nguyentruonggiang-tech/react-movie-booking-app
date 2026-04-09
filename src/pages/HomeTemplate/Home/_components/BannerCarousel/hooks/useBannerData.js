import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBannerList } from "@pages/HomeTemplate/Home/bannerSlice";

export default function useBannerData() {
    const dispatch = useDispatch();

    const { data, loading, error } = useSelector((state) => state.bannerReducer);

    const banners = useMemo(() => {
        return Array.isArray(data) ? data : [];
    }, [data]);

    const refetch = useCallback(() => {
        dispatch(fetchBannerList());
    }, [dispatch]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        banners,
        loading,
        error,
        refetch,
    };
}
