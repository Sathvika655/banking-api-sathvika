package com.sathvika.banking_api.controller;

import com.sathvika.banking_api.entity.Account;
import com.sathvika.banking_api.entity.Transaction;
import com.sathvika.banking_api.repository.AccountRepository;
import com.sathvika.banking_api.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequest request) {
        Optional<Account> fromOpt = accountRepository.findByAccountNumber(request.fromAccountNumber);
        Optional<Account> toOpt = accountRepository.findByAccountNumber(request.toAccountNumber);

        if (fromOpt.isEmpty() || toOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Account not found");
        }

        Account fromAccount = fromOpt.get();
        Account toAccount = toOpt.get();

        if (fromAccount.getBalance() < request.amount) {
            return ResponseEntity.badRequest().body("Insufficient balance");
        }

        fromAccount.setBalance(fromAccount.getBalance() - request.amount);
        toAccount.setBalance(toAccount.getBalance() + request.amount);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction transaction = new Transaction();
        transaction.setType("TRANSFER");
        transaction.setAmount(request.amount);
        transaction.setFromAccountNumber(request.fromAccountNumber);
        transaction.setToAccountNumber(request.toAccountNumber);
        transaction.setAccount(fromAccount);
        transactionRepository.save(transaction);

        return ResponseEntity.ok("Transfer successful: $" + request.amount);
    }
}

class TransferRequest {
    public String fromAccountNumber;
    public String toAccountNumber;
    public Double amount;
}



