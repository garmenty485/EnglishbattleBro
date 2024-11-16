import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export function useRecords(userInfo) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userInfo?.email) {
        console.log('No userInfo.email found, skipping fetch');
        setIsLoading(false);
        return;
      }

      console.log('Fetching records for user:', userInfo.email);
      try {
        const response = await fetch(`/api/records/user/${userInfo.email}`);
        console.log('API Response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch records');
        
        const data = await response.json();
        console.log('Fetched records:', data);
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
        toast({
          title: "Error",
          description: "Failed to load records", 
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [userInfo, toast]);

  return { records, isLoading };
}